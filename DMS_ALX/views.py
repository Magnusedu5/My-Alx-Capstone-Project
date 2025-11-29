from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.contrib.auth import logout, authenticate, login
from django.contrib import messages
from django.urls import reverse_lazy
from django.views.decorators.csrf import csrf_exempt
from .models import Result, Document, Session
from .forms import ResultUploadForm, DocumentUploadForm
from django.http import HttpResponse
from django.contrib.staticfiles import finders
from django.conf import settings
from pathlib import Path

# Custom Login View (standard Django login)
class CustomLoginView(LoginView):
    template_name = 'registration/login.html'
    redirect_authenticated_user = True  # Redirect if already authenticated

    def get_success_url(self):
        return reverse_lazy('dashboard')

    def form_valid(self, form):
        # Log successful login
        print(f"Login successful for user: {form.get_user()}")
        return super().form_valid(form)

    def form_invalid(self, form):
        # Log failed login attempts
        print(f"Login failed: {form.errors}")
        return super().form_invalid(form)


# Simple Login View
@csrf_exempt
def simple_login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid username or password.')

    return render(request, 'registration/login.html')

# Dashboard
@login_required
def dashboard(request):
    user = request.user

    # Get user statistics
    my_results = Result.objects.filter(uploaded_by=user).count()
    my_documents = Document.objects.filter(uploaded_by=user).count()

    # Get pending items for HODs
    pending_results = 0
    pending_documents = 0

    if user.role == 'HOD':
        pending_results = Result.objects.filter(status='PENDING').count()
        pending_documents = Document.objects.filter(status='PENDING').count()

    context = {
        'user': user,
        'my_results': my_results,
        'my_documents': my_documents,
        'pending_results': pending_results,
        'pending_documents': pending_documents,
    }

    return render(request, "dashboard.html", context)


# Results Views
@login_required
def results_list(request):
    # Get filter options
    sessions = Session.objects.all()
    semesters = Result.SEMESTER_CHOICES

    # Start with all results
    results = Result.objects.all().order_by('-upload_date')

    # Apply filters
    session_id = request.GET.get('session')
    semester = request.GET.get('semester')
    course_code = request.GET.get('course_code')

    if session_id:
        results = results.filter(session_id=session_id)
    if semester:
        results = results.filter(semester=semester)
    if course_code:
        results = results.filter(course_code__icontains=course_code)

    context = {
        'results': results,
        'sessions': sessions,
        'semesters': semesters,
        'selected_session': session_id,
        'selected_semester': semester,
        'search_course': course_code,
    }

    return render(request, 'results/results_list.html', context)


@login_required
def upload_result(request):
    if request.method == 'POST':
        form = ResultUploadForm(request.POST, request.FILES)
        if form.is_valid():
            result = form.save(commit=False)
            result.uploaded_by = request.user
            result.save()
            messages.success(request, 'Result uploaded successfully!')
            return redirect('results_list')
    else:
        form = ResultUploadForm()

    return render(request, 'results/upload_result.html', {'form': form})


# Documents Views
@login_required
def documents_list(request):
    documents = Document.objects.all().order_by('-upload_date')

    # Filter by status if requested
    status = request.GET.get('status')
    if status:
        documents = documents.filter(status=status)

    context = {
        'documents': documents,
        'status_choices': Document.STATUS_CHOICES,
        'selected_status': status,
    }

    return render(request, 'documents/documents_list.html', context)


@login_required
def upload_document(request):
    if request.method == 'POST':
        form = DocumentUploadForm(request.POST, request.FILES)
        if form.is_valid():
            document = form.save(commit=False)
            document.uploaded_by = request.user
            document.save()
            messages.success(request, 'Document uploaded successfully!')
            return redirect('documents_list')
    else:
        form = DocumentUploadForm()

    return render(request, 'documents/upload_document.html', {'form': form})


# HOD Approval Views
@login_required
def approve_results(request):
    if request.user.role != 'HOD':
        messages.error(request, "Access denied. HOD role required.")
        return redirect('dashboard')

    pending_results = Result.objects.filter(status='PENDING').order_by('-upload_date')

    if request.method == 'POST':
        result_id = request.POST.get('result_id')
        action = request.POST.get('action')

        result = get_object_or_404(Result, id=result_id)

        if action == 'approve':
            result.status = 'APPROVED'
            result.save()
            messages.success(request, f'Result for {result.course_code} approved!')
        elif action == 'reject':
            result.status = 'REJECTED'
            result.save()
            messages.warning(request, f'Result for {result.course_code} rejected!')

        return redirect('approve_results')

    return render(request, 'hod/approve_results.html', {'results': pending_results})


@login_required
def approve_documents(request):
    if request.user.role != 'HOD':
        messages.error(request, "Access denied. HOD role required.")
        return redirect('dashboard')

    pending_documents = Document.objects.filter(status='PENDING').order_by('-upload_date')

    if request.method == 'POST':
        document_id = request.POST.get('document_id')
        action = request.POST.get('action')

        document = get_object_or_404(Document, id=document_id)

        if action == 'approve':
            document.status = 'APPROVED'
            document.save()
            messages.success(request, f'Document "{document.title}" approved!')
        elif action == 'reject':
            document.status = 'REJECTED'
            document.save()
            messages.warning(request, f'Document "{document.title}" rejected!')

        return redirect('approve_documents')

    return render(request, 'hod/approve_documents.html', {'documents': pending_documents})



# Custom Logout View
def custom_logout(request):
    logout(request)
    messages.success(request, 'You have been successfully logged out.')
    return redirect('login')


# Serve React index.html from built static files (used in production Docker/Render)
def serve_react_index(request, path=''):
    """Return the compiled frontend `index.html` from staticfiles.

    This lets Django serve the SPA for all non-API routes when the frontend
    build has been copied into STATIC_ROOT (our Dockerfile does this).
    """
    # Try staticfiles finders first (works when index is collected into static dirs).
    # `finders.find` may return a single path or a list of paths depending on
    # storage backends; normalize to a single string path so `open()` accepts it.
    index_result = finders.find('index.html')
    index_path = None
    if index_result:
        if isinstance(index_result, (list, tuple)):
            index_path = index_result[0]
        else:
            index_path = index_result

    # If not found, try STATIC_ROOT/index.html (common when collectstatic copied files there)
    if not index_path and getattr(settings, 'STATIC_ROOT', None):
        candidate = Path(settings.STATIC_ROOT) / 'index.html'
        if candidate.exists():
            index_path = str(candidate)

    # If still not found, try frontend/dist/index.html (useful for local builds)
    if not index_path:
        candidate = Path(settings.BASE_DIR) / 'frontend' / 'dist' / 'index.html'
        if candidate.exists():
            index_path = str(candidate)

    if not index_path:
        return HttpResponse('Frontend build not found', status=404)

    try:
        with open(index_path, 'rb') as f:
            return HttpResponse(f.read(), content_type='text/html')
    except Exception as e:
        return HttpResponse(f'Error reading frontend index: {e}', status=500)

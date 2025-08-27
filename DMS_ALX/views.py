from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Result, Document
from .forms import ResultUploadForm, DocumentUploadForm
from django.contrib.auth.views import LoginView
from django.contrib import messages
from django.urls import reverse_lazy

# Dashboard
def dashboard(request):
        return render(request, "/home/magnus/My_ALX_Project/Alx_Capstone_project/DMS_ALX/templates/dashboard.html")


# ---------------- RESULTS ---------------- #
class ResultListView(LoginRequiredMixin, View):
    def get(self, request):
        results = Result.objects.all()
        return render(request, "/home/magnus/My_ALX_Project/Alx_Capstone_project/DMS_ALX/templates/results/results.html", {"results": results})


class ResultUploadView(LoginRequiredMixin, View):
    def get(self, request):
        form = ResultUploadForm()
        return render(request, "/home/magnus/My_ALX_Project/Alx_Capstone_project/DMS_ALX/templates/results/upload.html", {"form": form})

    def post(self, request):
        form = ResultUploadForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect("results_list")
        return render(request, "/home/magnus/My_ALX_Project/Alx_Capstone_project/DMS_ALX/templates/results/upload.html", {"form": form})


# ---------------- DOCUMENTS ---------------- #
class DocumentListView(LoginRequiredMixin, View):
    def get(self, request):
        documents = Document.objects.all()
        return render(request, "/home/magnus/My_ALX_Project/Alx_Capstone_project/DMS_ALX/templates/documents/view_documents.html", {"documents": documents})


class DocumentUploadView(LoginRequiredMixin, View):
    def get(self, request):
        form = DocumentUploadForm()
        return render(request, "/home/magnus/My_ALX_Project/Alx_Capstone_project/DMS_ALX/templates/documents/upload_document.html", {"form": form})

    def post(self, request):
        form = DocumentUploadForm(request.POST, request.FILES)
        if form.is_valid():
            document = form.save(commit=False)   # don’t save yet
            document.uploaded_by = request.user  # attach current user
            document.save()
            return redirect("documents_list")
        return render(request, "/home/magnus/My_ALX_Project/Alx_Capstone_project/DMS_ALX/templates/documents/upload_document.html", {"form": form})


class ApprovedUserLoginView(LoginView):
    template_name = "registration/login.html"   # path to your login template

    def form_valid(self, form):
        user = form.get_user()
        
        if hasattr(user, "is_approved") and not user.is_approved:
            messages.error(self.request, "Your account is not approved yet.")
            return redirect("login")
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy("dashboard")  # dashboard is the name of your urlpattern

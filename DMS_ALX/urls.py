from django.urls import path
from django.shortcuts import redirect
from . import views

def redirect_to_dashboard(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    return redirect('login')

urlpatterns = [
    path("", redirect_to_dashboard, name="home"),
    # Use our CustomLoginView so redirects and logging are consistent
    path("login/", views.CustomLoginView.as_view(), name="login"),
    path("logout/", views.custom_logout, name="logout"),
    path("dashboard/", views.dashboard, name="dashboard"),

    # Results
    path("results/", views.results_list, name="results_list"),
    path("results/upload/", views.upload_result, name="upload_result"),

    # Documents
    path("documents/", views.documents_list, name="documents_list"),
    path("documents/upload/", views.upload_document, name="upload_document"),

    # HOD specific URLs
    path("hod/approve-results/", views.approve_results, name="approve_results"),
    path("hod/approve-documents/", views.approve_documents, name="approve_documents"),
]

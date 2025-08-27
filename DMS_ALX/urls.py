from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.ApprovedUserLoginView.as_view(), name="login"),
    path("dashboard/", views.dashboard, name="dashboard"),

    # Results
    path("results/", views.ResultListView.as_view(), name="results_list"),
    path("results/upload/", views.ResultUploadView.as_view(), name="results_upload"),

    # Documents
    path("documents/", views.DocumentListView.as_view(), name="documents_list"),
    path("documents/upload/", views.DocumentUploadView.as_view(), name="upload_document"),
]

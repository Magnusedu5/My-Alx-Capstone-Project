from django.urls import path
from . import views

urlpatterns = [
    path('api/results/retrieve', views.getresult, name='get_results'),
    path('api/results/upload/', views.uploadresult, name='upload_result'),

    path('api/documents/retieve', views.getdocument, name='get_documents'),
    path('api/documents/upload/', views.uploaddocument, name='upload_document'),
]

"""
API URL Configuration for Document Management System

These URLs handle REST API endpoints for the React frontend
All URLs are prefixed with /api/ in the main project urls.py
"""

from django.urls import path
from . import api_views

urlpatterns = [
    # =============================================================================
    # AUTHENTICATION ENDPOINTS
    # =============================================================================
    path('login/', api_views.login_view, name='api_login'),
    path('logout/', api_views.logout_view, name='api_logout'),

    # =============================================================================
    # DASHBOARD ENDPOINT
    # =============================================================================
    path('dashboard/', api_views.dashboard_view, name='api_dashboard'),

    # =============================================================================
    # DOCUMENT ENDPOINTS
    # =============================================================================
    path('documents/', api_views.DocumentListView.as_view(), name='api_documents_list'),
    path('documents/upload/', api_views.DocumentUploadView.as_view(), name='api_documents_upload'),
    path('documents/bulk-delete/', api_views.document_bulk_delete_view, name='api_documents_bulk_delete'),
    path('documents/<int:document_id>/approve/', api_views.document_approve_view, name='api_documents_approve'),
    path('documents/<int:document_id>/reject/', api_views.document_reject_view, name='api_documents_reject'),
    path('documents/<int:document_id>/', api_views.DocumentDeleteView.as_view(), name='api_documents_delete'),

    # =============================================================================
    # RESULT ENDPOINTS
    # =============================================================================
    path('results/', api_views.ResultListView.as_view(), name='api_results_list'),
    path('results/upload/', api_views.ResultUploadView.as_view(), name='api_results_upload'),
    path('results/bulk-delete/', api_views.result_bulk_delete_view, name='api_results_bulk_delete'),
    path('results/filter/', api_views.result_filter_view, name='api_results_filter'),
    path('results/<int:result_id>/approve/', api_views.result_approve_view, name='api_results_approve'),
    path('results/<int:result_id>/reject/', api_views.result_reject_view, name='api_results_reject'),
    path('results/<int:result_id>/', api_views.ResultDeleteView.as_view(), name='api_results_delete'),
    # Profile endpoint
    path('profile/', api_views.profile_view, name='api_profile'),
]

"""
API Endpoint Summary for Frontend Integration:

AUTHENTICATION:
POST /api/login/          - Login with email/password, returns JWT token
POST /api/logout/         - Logout (frontend removes token)

DASHBOARD:
GET  /api/dashboard/      - Get dashboard data (role-based)

DOCUMENTS:
GET    /api/documents/           - List documents (filtered by role)
POST   /api/documents/upload/    - Upload new document
POST   /api/documents/bulk-delete/ - Bulk delete documents
DELETE /api/documents/{id}/      - Delete single document
PATCH  /api/documents/{id}/approve/ - Approve document (HOD only)
PATCH  /api/documents/{id}/reject/  - Reject document (HOD only)

RESULTS:
GET    /api/results/             - List results (filtered by role)
POST   /api/results/upload/      - Upload new result
POST   /api/results/bulk-delete/ - Bulk delete results
DELETE /api/results/{id}/        - Delete single result
GET    /api/results/filter/      - Filter results by session/semester/course
PATCH  /api/results/{id}/approve/ - Approve result (HOD only)
PATCH  /api/results/{id}/reject/  - Reject result (HOD only)
"""
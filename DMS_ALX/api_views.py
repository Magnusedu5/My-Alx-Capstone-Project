"""
API Views for the Document Management System
These views handle REST API requests and return JSON responses for the React frontend
"""

from rest_framework import generics, status, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q
from django.shortcuts import get_object_or_404
from typing import cast

from .models import CustomUser, Document, Result, Session
from .serializers import (
    UserSerializer, LoginSerializer, DocumentSerializer, ResultSerializer,
    DocumentUploadSerializer, ResultUploadSerializer, DashboardSerializer
)


# =============================================================================
# AUTHENTICATION VIEWS
# =============================================================================

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """
    POST /api/login/

    Authenticates user and returns JWT tokens

    Request body:
    {
        "email": "user@example.com",
        "password": "password123"
    }

    Response:
    {
        "token": "jwt-access-token",
        "refresh": "jwt-refresh-token",
        "user": {
            "id": 1,
            "email": "user@example.com",
            "role": "staff"
        }
    }
    """
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        validated = cast(dict, serializer.validated_data)
        user = cast(CustomUser, validated['user'])

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Serialize user data
        raw_user = UserSerializer(user).data
        user_data = dict(raw_user)
        # Keep role as uppercase for frontend consistency
        # Frontend expects 'HOD' or 'STAFF', not lowercase

        return Response({
            'token': access_token,
            'refresh': str(refresh),
            'user': user_data
        }, status=status.HTTP_200_OK)

    return Response({
        'error': 'Invalid credentials',
        'details': serializer.errors
    }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profile_view(request):
    """
    GET /api/profile/

    Returns serialized profile of the authenticated user.
    """
    user = cast(CustomUser, request.user)
    raw_user = UserSerializer(user).data
    user_data = dict(raw_user)
    # Keep role as uppercase (HOD/STAFF)
    return Response(user_data)


@api_view(['POST'])
def logout_view(request):
    """
    POST /api/logout/

    Logs out user (frontend should remove token)
    """
    return Response({
        'message': 'Successfully logged out'
    }, status=status.HTTP_200_OK)


# =============================================================================
# DASHBOARD VIEW
# =============================================================================

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_view(request):
    """
    GET /api/dashboard/

    Returns dashboard data for the authenticated user

    Response varies based on user role (staff vs HOD)
    """
    user = cast(CustomUser, request.user)

    # Base statistics for all users
    my_documents = Document.objects.filter(uploaded_by=user).count()
    my_results = Result.objects.filter(uploaded_by=user).count()

    dashboard_data = {
        'user': UserSerializer(user).data,
        'role': user.role,  # Keep as uppercase (HOD/STAFF)
        'total_documents': my_documents,
        'total_results': my_results,
        'recent_uploads': my_documents + my_results,
        'pending_approvals': 0
    }

    # Additional data for HOD users
    if user.role == 'HOD':
        pending_documents = Document.objects.filter(status='PENDING').count()
        pending_results = Result.objects.filter(status='PENDING').count()

        dashboard_data.update({
            'total_documents': Document.objects.count(),
            'total_results': Result.objects.count(),
            'pending_approvals': pending_documents + pending_results,
            'pending_documents': pending_documents,
            'pending_results': pending_results,
        })

    return Response(dashboard_data)


# =============================================================================
# DOCUMENT VIEWS
# =============================================================================

class DocumentListView(generics.ListAPIView):
    """
    GET /api/documents/

    Returns list of documents based on user role:
    - Staff: Only their own documents
    - HOD: All documents
    """
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = cast(CustomUser, self.request.user)
        if user.role == 'HOD':
            return Document.objects.all().order_by('-upload_date')
        else:
            return Document.objects.filter(uploaded_by=user).order_by('-upload_date')


class DocumentUploadView(generics.CreateAPIView):
    """
    POST /api/documents/upload/

    Uploads a new document

    Request: multipart/form-data with:
    - title: string
    - description: string (optional)
    - category: string (optional)
    - file: file upload
    """
    serializer_class = DocumentUploadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            document = serializer.save()

            # Return the created document with full details
            response_serializer = DocumentSerializer(document)
            return Response({
                'message': 'Document uploaded successfully',
                'document': response_serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'error': 'Upload failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def document_approve_view(request, document_id):
    """
    PATCH /api/documents/{id}/approve/

    Approves a document (HOD only)
    """
    if request.user.role != 'HOD':
        return Response({
            'error': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)

    document = get_object_or_404(Document, id=document_id)
    document.status = 'APPROVED'
    document.save()

    return Response({
        'message': 'Document approved successfully',
        'document': DocumentSerializer(document).data
    })


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def document_reject_view(request, document_id):
    """
    PATCH /api/documents/{id}/reject/

    Rejects a document (HOD only)
    """
    if request.user.role != 'HOD':
        return Response({
            'error': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)

    document = get_object_or_404(Document, id=document_id)
    document.status = 'REJECTED'
    document.save()

    return Response({
        'message': 'Document rejected',
        'document': DocumentSerializer(document).data
    })


# =============================================================================
# RESULT VIEWS
# =============================================================================

class ResultListView(generics.ListAPIView):
    """
    GET /api/results/

    Returns list of results based on user role:
    - Staff: Only their own results
    - HOD: All results
    """
    serializer_class = ResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = cast(CustomUser, self.request.user)
        if user.role == 'HOD':
            return Result.objects.all().order_by('-upload_date')
        else:
            return Result.objects.filter(uploaded_by=user).order_by('-upload_date')


class ResultUploadView(generics.CreateAPIView):
    """
    POST /api/results/upload/

    Uploads a new result

    Request: multipart/form-data with:
    - course_code: string
    - course_title: string (optional)
    - session: string (e.g., "2023/2024")
    - semester: string ("first" or "second")
    - level: string (optional)
    - file: file upload
    """
    serializer_class = ResultUploadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            result = serializer.save()

            # Return the created result with full details
            response_serializer = ResultSerializer(result)
            return Response({
                'message': 'Result uploaded successfully',
                'result': response_serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'error': 'Upload failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def result_filter_view(request):
    """
    GET /api/results/filter/

    Filters results by session, semester, and course_code

    Query parameters:
    - session: string (optional)
    - semester: string (optional)
    - course_code: string (optional)
    """
    queryset = Result.objects.all()

    # Apply filters based on query parameters
    session_param = request.GET.get('session')
    semester_param = request.GET.get('semester')
    course_code_param = request.GET.get('course_code')

    if session_param:
        queryset = queryset.filter(session__name__icontains=session_param)

    if semester_param:
        queryset = queryset.filter(semester__icontains=semester_param)

    if course_code_param:
        queryset = queryset.filter(course_code__icontains=course_code_param)

    # Limit to user's own results if not HOD
    user = cast(CustomUser, request.user)
    if user.role != 'HOD':
        queryset = queryset.filter(uploaded_by=user)

    queryset = queryset.order_by('-upload_date')

    serializer = ResultSerializer(queryset, many=True)
    return Response({
        'results': serializer.data,
        'count': queryset.count()
    })


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def result_approve_view(request, result_id):
    """
    PATCH /api/results/{id}/approve/

    Approves a result (HOD only)
    """
    if request.user.role != 'HOD':
        return Response({
            'error': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)

    result = get_object_or_404(Result, id=result_id)
    result.status = 'APPROVED'
    result.save()

    return Response({
        'message': 'Result approved successfully',
        'result': ResultSerializer(result).data
    })


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def result_reject_view(request, result_id):
    """
    PATCH /api/results/{id}/reject/

    Rejects a result (HOD only)
    """
    if request.user.role != 'HOD':
        return Response({
            'error': 'Permission denied'
        }, status=status.HTTP_403_FORBIDDEN)

    result = get_object_or_404(Result, id=result_id)
    result.status = 'REJECTED'
    result.save()

    return Response({
        'message': 'Result rejected',
        'result': ResultSerializer(result).data
    })


class DocumentDeleteView(generics.DestroyAPIView):
    """DELETE /api/documents/{id}/ - delete a document

    - HOD can delete any document
    - Staff can delete only their own documents
    """
    queryset = Document.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'document_id'

    def perform_destroy(self, instance):
        from .utils.google_drive import delete_from_drive
        
        user = cast(CustomUser, self.request.user)
        if user.role != 'HOD' and instance.uploaded_by != user:
            raise PermissionDenied('Cannot delete this document')
        
        # Delete from Google Drive if file exists there
        if instance.gdrive_file_id:
            try:
                delete_from_drive(instance.gdrive_file_id)
                print(f"✅ Deleted from Google Drive: {instance.title}")
            except Exception as e:
                print(f"⚠️  Failed to delete from Google Drive: {e}")
        
        # Delete local file if exists
        if instance.file:
            try:
                instance.file.delete()
                print(f"✅ Deleted local file: {instance.title}")
            except Exception as e:
                print(f"⚠️  Failed to delete local file: {e}")
        
        # Delete database record
        instance.delete()


class ResultDeleteView(generics.DestroyAPIView):
    """DELETE /api/results/{id}/ - delete a result

    - HOD can delete any result
    - Staff can delete only their own results
    """
    queryset = Result.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'result_id'

    def perform_destroy(self, instance):
        from .utils.google_drive import delete_from_drive
        
        user = cast(CustomUser, self.request.user)
        if user.role != 'HOD' and instance.uploaded_by != user:
            raise PermissionDenied('Cannot delete this result')
        
        # Delete from Google Drive if file exists there
        if instance.gdrive_file_id:
            try:
                delete_from_drive(instance.gdrive_file_id)
                print(f"✅ Deleted from Google Drive: {instance.course_code}")
            except Exception as e:
                print(f"⚠️  Failed to delete from Google Drive: {e}")
        
        # Delete local file if exists
        if instance.file:
            try:
                instance.file.delete()
                print(f"✅ Deleted local file: {instance.course_code}")
            except Exception as e:
                print(f"⚠️  Failed to delete local file: {e}")
        
        # Delete database record
        instance.delete()


# =============================================================================
# BULK DELETE VIEWS
# =============================================================================

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def document_bulk_delete_view(request):
    """
    POST /api/documents/bulk-delete/
    
    Bulk delete multiple documents
    
    Request body:
    {
        "ids": [1, 2, 3, 4]
    }
    
    Response:
    {
        "message": "Successfully deleted 4 document(s)",
        "deleted_count": 4,
        "errors": null
    }
    """
    from .utils.google_drive import delete_from_drive
    
    document_ids = request.data.get('ids', [])
    
    if not document_ids:
        return Response(
            {'error': 'No document IDs provided'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = cast(CustomUser, request.user)
    
    # Get documents (filter by ownership if not HOD)
    if user.role == 'HOD':
        documents = Document.objects.filter(id__in=document_ids)
    else:
        documents = Document.objects.filter(id__in=document_ids, uploaded_by=user)
    
    deleted_count = 0
    errors = []
    
    for doc in documents:
        try:
            # Delete from Google Drive
            if doc.gdrive_file_id:
                delete_from_drive(doc.gdrive_file_id)
            
            # Delete local file
            if doc.file:
                doc.file.delete()
            
            # Delete database record
            doc.delete()
            deleted_count += 1
            
        except Exception as e:
            errors.append(f"Failed to delete {doc.title}: {str(e)}")
    
    return Response({
        'message': f'Successfully deleted {deleted_count} document(s)',
        'deleted_count': deleted_count,
        'errors': errors if errors else None
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def result_bulk_delete_view(request):
    """
    POST /api/results/bulk-delete/
    
    Bulk delete multiple results
    
    Request body:
    {
        "ids": [1, 2, 3, 4]
    }
    
    Response:
    {
        "message": "Successfully deleted 4 result(s)",
        "deleted_count": 4,
        "errors": null
    }
    """
    from .utils.google_drive import delete_from_drive
    
    result_ids = request.data.get('ids', [])
    
    if not result_ids:
        return Response(
            {'error': 'No result IDs provided'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = cast(CustomUser, request.user)
    
    # Get results (filter by ownership if not HOD)
    if user.role == 'HOD':
        results = Result.objects.filter(id__in=result_ids)
    else:
        results = Result.objects.filter(id__in=result_ids, uploaded_by=user)
    
    deleted_count = 0
    errors = []
    
    for result in results:
        try:
            # Delete from Google Drive
            if result.gdrive_file_id:
                delete_from_drive(result.gdrive_file_id)
            
            # Delete local file
            if result.file:
                result.file.delete()
            
            # Delete database record
            result.delete()
            deleted_count += 1
            
        except Exception as e:
            errors.append(f"Failed to delete {result.course_code}: {str(e)}")
    
    return Response({
        'message': f'Successfully deleted {deleted_count} result(s)',
        'deleted_count': deleted_count,
        'errors': errors if errors else None
    }, status=status.HTTP_200_OK)
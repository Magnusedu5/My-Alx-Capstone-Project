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
        # Normalize role to lowercase for frontend consistency
        user_data['role'] = (user_data.get('role') or '').lower()

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
    user_data['role'] = (user_data.get('role') or '').lower()
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
        'role': user.role.lower(),
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
        user = cast(CustomUser, self.request.user)
        if user.role != 'HOD' and instance.uploaded_by != user:
            raise PermissionDenied('Cannot delete this document')
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
        user = cast(CustomUser, self.request.user)
        if user.role != 'HOD' and instance.uploaded_by != user:
            raise PermissionDenied('Cannot delete this result')
        instance.delete()
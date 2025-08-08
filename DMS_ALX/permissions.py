
from rest_framework.permissions import BasePermission

class IsHOD(BasePermission):
    """
    Allows access only to users who are HODs.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_hod


class IsStaff(BasePermission):
    """
    Allows access only to users who are staff (but not HODs).
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and not request.user.is_hod


class IsOwnerOrHOD(BasePermission):
    """
    Allows access to the owner of the object or to the HOD.
    """
    def has_object_permission(self, request, view, obj):
        return request.user.is_hod or obj.uploaded_by == request.user

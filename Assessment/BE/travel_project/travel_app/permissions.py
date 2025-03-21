from rest_framework.permissions import BasePermission

class IsAdminOrOwner(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated  

    def has_object_permission(self, request, view, obj):
        return request.user.role == "admin" or obj.user == request.user


class IsAdmin(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "admin"
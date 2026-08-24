from rest_framework import permissions


class IsAdminRole(permissions.BasePermission):

    message = "Only administrators can perform this action."

    def has_permission(self, request, view):

        if not request.user or not request.user.is_authenticated:
            return False

        try:
            profile = request.user.profile
            return (
                profile.role == 'admin'
                and profile.is_active
                and request.user.is_staff
            )

        except Exception:
            return False
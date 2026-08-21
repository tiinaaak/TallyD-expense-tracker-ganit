from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Allows any authenticated user to list/create (queryset filtering
    in the view handles ownership scoping for those actions).

    For object-level actions (retrieve/update/delete), only allows
    access if the object belongs to the requesting user, or the
    requesting user is an admin (is_staff=True).
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.user == request.user
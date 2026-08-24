from django.urls import path

from .views import (
    RegisterView,
    LoginView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    UserListView,
    UserRoleUpdateView,
    UserStatusUpdateView,
    UserDeleteView,
)


urlpatterns = [

    path(
        'register/',
        RegisterView.as_view(),
        name='register'
    ),

    path(
        'login/',
        LoginView.as_view(),
        name='login'
    ),

    path(
        'password-reset/',
        PasswordResetRequestView.as_view(),
        name='password-reset'
    ),

    path(
        'password-reset-confirm/',
        PasswordResetConfirmView.as_view(),
        name='password-reset-confirm'
    ),

    # Admin users
    path(
        'users/',
        UserListView.as_view(),
        name='user-list'
    ),

    # Change role
    path(
        'users/<int:user_id>/role/',
        UserRoleUpdateView.as_view(),
        name='user-role-update'
    ),

    # Enable / disable
    path(
        'users/<int:user_id>/status/',
        UserStatusUpdateView.as_view(),
        name='user-status-update'
    ),

    # Delete user
    path(
        'users/<int:user_id>/',
        UserDeleteView.as_view(),
        name='user-delete'
    ),
]
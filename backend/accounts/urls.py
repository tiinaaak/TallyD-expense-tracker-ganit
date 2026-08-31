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
    NotificationListView,
    NotificationReadView,
    NotificationReadAllView,
)


urlpatterns = [

    # ========================================================
    # Authentication
    # ========================================================

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


    # ========================================================
    # Admin / User Management
    # ========================================================

    path(
        'users/',
        UserListView.as_view(),
        name='user-list'
    ),

    path(
        'users/<int:user_id>/role/',
        UserRoleUpdateView.as_view(),
        name='user-role-update'
    ),

    path(
        'users/<int:user_id>/status/',
        UserStatusUpdateView.as_view(),
        name='user-status-update'
    ),

    path(
        'users/<int:user_id>/',
        UserDeleteView.as_view(),
        name='user-delete'
    ),


    # ========================================================
    # Notifications
    # ========================================================

    path(
        'notifications/',
        NotificationListView.as_view(),
        name='notifications'
    ),

    path(
        'notifications/read-all/',
        NotificationReadAllView.as_view(),
        name='notifications-read-all'
    ),

    path(
        'notifications/<int:pk>/read/',
        NotificationReadView.as_view(),
        name='notification-read'
    ),
]
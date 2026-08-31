from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMultiAlternatives
from django.db.models import Count, Sum

from .models import UserProfile, Notification

from .serializers import (
    RegisterSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    UserListSerializer,
    NotificationSerializer,
)


# ============================================================
# REGISTER
# ============================================================

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()

        UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'role': UserProfile.ROLE_USER,
                'is_active': True,
            }
        )


# ============================================================
# LOGIN
# ============================================================

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {
                    'error': 'Email and password are required.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_obj = User.objects.get(
                email__iexact=email
            )
        except User.DoesNotExist:
            return Response(
                {
                    'error': 'Invalid credentials'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check UserProfile status
        try:
            profile = user_obj.profile

        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(
                user=user_obj,
                role=(
                    UserProfile.ROLE_ADMIN
                    if user_obj.is_staff
                    else UserProfile.ROLE_USER
                ),
                is_active=True
            )

        # Block disabled accounts
        if not profile.is_active:
            return Response(
                {
                    'error': (
                        'Your account has been disabled. '
                        'Please contact an administrator.'
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )

        user = authenticate(
            username=user_obj.username,
            password=password
        )

        if not user:
            return Response(
                {
                    'error': 'Invalid credentials'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        token, _ = Token.objects.get_or_create(
            user=user
        )

        return Response(
            {
                'token': token.key,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'role': profile.role,
                'is_active': profile.is_active,
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# PASSWORD RESET REQUEST
# ============================================================

class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        email = serializer.validated_data['email']

        try:
            user = User.objects.get(
                email__iexact=email
            )
        except User.DoesNotExist:
            return Response(
                {
                    'message': (
                        'If that email exists, '
                        'a reset link has been sent.'
                    )
                },
                status=status.HTTP_200_OK
            )

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        token = default_token_generator.make_token(
            user
        )

        reset_link = (
            f"http://localhost:3000/"
            f"reset-password/{uid}/{token}/"
        )

        subject = 'Reset your TallyD password'

        plain_message = (
            f"Hi,\n\n"
            f"We received a request to reset your TallyD password.\n"
            f"Click the link below to choose a new password:\n\n"
            f"{reset_link}\n\n"
            f"If you didn't request this, you can safely ignore this email.\n\n"
            f"— The TallyD Team"
        )

        html_message = f"""
        <div style="
            font-family: Arial, sans-serif;
            max-width: 480px;
            margin: 0 auto;
            padding: 24px;
            border: 1px solid #E4E8EE;
            border-radius: 12px;
        ">

            <div style="
                text-align: center;
                margin-bottom: 24px;
            ">

                <div style="
                    width: 44px;
                    height: 44px;
                    background-color: #2E2A8C;
                    color: #FFFFFF;
                    border-radius: 10px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 20px;
                    line-height: 44px;
                ">
                    T
                </div>

                <h2 style="
                    color: #16233F;
                    margin: 12px 0 0;
                ">
                    TallyD
                </h2>

                <p style="
                    color: #6B7686;
                    font-size: 13px;
                    margin: 4px 0 0;
                ">
                    Every expense counted.
                </p>

            </div>

            <p style="
                color: #16233F;
                font-size: 15px;
            ">
                Hi,
            </p>

            <p style="
                color: #16233F;
                font-size: 15px;
            ">
                We received a request to reset the password
                for your TallyD account.
                Click the button below to choose a new password.
            </p>

            <div style="
                text-align: center;
                margin: 28px 0;
            ">

                <a
                    href="{reset_link}"
                    style="
                        background-color: #F5821F;
                        color: #FFFFFF;
                        padding: 12px 28px;
                        border-radius: 8px;
                        text-decoration: none;
                        font-weight: 600;
                        display: inline-block;
                    "
                >
                    Reset Password
                </a>

            </div>

            <p style="
                color: #6B7686;
                font-size: 13px;
            ">
                If the button doesn't work, copy and paste
                this link into your browser:
                <br>

                <a
                    href="{reset_link}"
                    style="color: #2E2A8C;"
                >
                    {reset_link}
                </a>
            </p>

            <p style="
                color: #A0A8B4;
                font-size: 12px;
                margin-top: 24px;
            ">
                If you didn't request this,
                you can safely ignore this email.
            </p>

        </div>
        """

        email_msg = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email='tinakashyap2024@gmail.com',
            to=[email],
        )

        email_msg.attach_alternative(
            html_message,
            "text/html"
        )

        email_msg.send()

        return Response(
            {
                'message': (
                    'If that email exists, '
                    'a reset link has been sent.'
                )
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# PASSWORD RESET CONFIRM
# ============================================================

class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        uid = serializer.validated_data['uid']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            user_id = force_str(
                urlsafe_base64_decode(uid)
            )

            user = User.objects.get(
                pk=user_id
            )

        except (
            User.DoesNotExist,
            ValueError,
            TypeError,
            OverflowError
        ):
            return Response(
                {
                    'error': 'Invalid reset link'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(
            user,
            token
        ):
            return Response(
                {
                    'error': 'Invalid or expired token'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {
                'message': (
                    'Password has been reset successfully'
                )
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# ADMIN - LIST USERS
# ============================================================

class UserListView(generics.ListAPIView):
    """
    Admin-only endpoint.

    Returns all users with role, status and
    expense statistics.
    """

    serializer_class = UserListSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return (
            User.objects
            .all()
            .select_related('profile')
            .annotate(
                expense_count=Count(
                    'expenses',
                    distinct=True
                ),
                total_spent=Sum(
                    'expenses__amount'
                ),
            )
            .order_by('username')
        )


# ============================================================
# ADMIN - CHANGE USER ROLE
# ============================================================

class UserRoleUpdateView(APIView):
    """
    Admin-only endpoint for changing a user's role.

    Supported roles:
    - user
    - manager
    - admin
    """

    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, user_id):

        try:
            target_user = User.objects.get(
                id=user_id
            )
        except User.DoesNotExist:
            return Response(
                {
                    'error': 'User not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        new_role = request.data.get('role')

        valid_roles = [
            UserProfile.ROLE_USER,
            UserProfile.ROLE_MANAGER,
            UserProfile.ROLE_ADMIN,
        ]

        if new_role not in valid_roles:
            return Response(
                {
                    'error': (
                        'Invalid role. Choose user, '
                        'manager, or admin.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        profile, _ = UserProfile.objects.get_or_create(
            user=target_user
        )

        profile.role = new_role
        profile.save()

        # Keep Django's is_staff consistent with admin role
        target_user.is_staff = (
            new_role == UserProfile.ROLE_ADMIN
        )

        target_user.save(
            update_fields=['is_staff']
        )

        return Response(
            {
                'message': 'User role updated successfully.',
                'user_id': target_user.id,
                'username': target_user.username,
                'role': profile.role,
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# ADMIN - ENABLE / DISABLE USER
# ============================================================

class UserStatusUpdateView(APIView):
    """
    Admin-only endpoint for enabling/disabling users.
    """

    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, user_id):

        try:
            target_user = User.objects.get(
                id=user_id
            )
        except User.DoesNotExist:
            return Response(
                {
                    'error': 'User not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        is_active = request.data.get('is_active')

        if not isinstance(is_active, bool):
            return Response(
                {
                    'error': (
                        'is_active must be true or false.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        profile, _ = UserProfile.objects.get_or_create(
            user=target_user
        )

        profile.is_active = is_active
        profile.save()

        return Response(
            {
                'message': (
                    'User enabled successfully.'
                    if is_active
                    else 'User disabled successfully.'
                ),
                'user_id': target_user.id,
                'username': target_user.username,
                'is_active': profile.is_active,
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# ADMIN - DELETE USER
# ============================================================

class UserDeleteView(APIView):
    """
    Admin-only endpoint for deleting users.
    """

    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, user_id):

        try:
            target_user = User.objects.get(
                id=user_id
            )
        except User.DoesNotExist:
            return Response(
                {
                    'error': 'User not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Prevent an admin from deleting their own account
        if target_user.id == request.user.id:
            return Response(
                {
                    'error': (
                        'You cannot delete your own account.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        username = target_user.username

        target_user.delete()

        return Response(
            {
                'message': (
                    f'User {username} deleted successfully.'
                )
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# NOTIFICATIONS - LIST
# ============================================================

class NotificationListView(APIView):
    """
    Returns notifications belonging only to
    the authenticated user.
    """

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):

        notifications = (
            Notification.objects
            .filter(user=request.user)
            .order_by('-created_at')
        )

        serializer = NotificationSerializer(
            notifications,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# ============================================================
# NOTIFICATIONS - MARK ONE AS READ
# ============================================================

class NotificationReadView(APIView):
    """
    Marks a single notification as read.

    A user can only modify their own notifications.
    """

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def patch(self, request, pk):

        try:
            notification = Notification.objects.get(
                pk=pk,
                user=request.user
            )

        except Notification.DoesNotExist:
            return Response(
                {
                    'detail': 'Notification not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        notification.is_read = True

        notification.save(
            update_fields=['is_read']
        )

        return Response(
            {
                'detail': (
                    'Notification marked as read.'
                )
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# NOTIFICATIONS - MARK ALL AS READ
# ============================================================

class NotificationReadAllView(APIView):
    """
    Marks all unread notifications belonging to
    the authenticated user as read.
    """

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def patch(self, request):

        Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(
            is_read=True
        )

        return Response(
            {
                'detail': (
                    'All notifications marked as read.'
                )
            },
            status=status.HTTP_200_OK
        )
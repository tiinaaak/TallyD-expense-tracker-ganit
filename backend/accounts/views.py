from rest_framework import generics, permissions
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMultiAlternatives
from .serializers import RegisterSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user_obj = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=400)

        user = authenticate(username=user_obj.username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'username': user.username})
        return Response({'error': 'Invalid credentials'}, status=400)


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'message': 'If that email exists, a reset link has been sent.'})

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"

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
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #E4E8EE; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 24px;">
                <div style="width: 44px; height: 44px; background-color: #2E2A8C; color: #FFFFFF; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px; line-height: 44px;">T</div>
                <h2 style="color: #16233F; margin: 12px 0 0;">TallyD</h2>
                <p style="color: #6B7686; font-size: 13px; margin: 4px 0 0;">Every expense counted.</p>
            </div>
            <p style="color: #16233F; font-size: 15px;">Hi,</p>
            <p style="color: #16233F; font-size: 15px;">
                We received a request to reset the password for your TallyD account.
                Click the button below to choose a new password.
            </p>
            <div style="text-align: center; margin: 28px 0;">
                <a href="{reset_link}"
                   style="background-color: #F5821F; color: #FFFFFF; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                   Reset Password
                </a>
            </div>
            <p style="color: #6B7686; font-size: 13px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{reset_link}" style="color: #2E2A8C;">{reset_link}</a>
            </p>
            <p style="color: #A0A8B4; font-size: 12px; margin-top: 24px;">
                If you didn't request this, you can safely ignore this email.
            </p>
        </div>
        """

        email_msg = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email='tinakashyap2024@gmail.com',
            to=[email],
        )
        email_msg.attach_alternative(html_message, "text/html")
        email_msg.send()

        return Response({'message': 'If that email exists, a reset link has been sent.'})


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uid = serializer.validated_data['uid']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({'error': 'Invalid reset link'}, status=400)

        if not default_token_generator.check_token(user, token):
            return Response({'error': 'Invalid or expired token'}, status=400)

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password has been reset successfully'})
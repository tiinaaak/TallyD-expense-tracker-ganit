import re

from django.contrib.auth.models import User
from django.db.models import Sum

from rest_framework import serializers

from .models import UserProfile, Notification


# ============================================================
# REGISTER
# ============================================================

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
        ]

    def validate_username(self, value):

        if User.objects.filter(
            username__iexact=value
        ).exists():
            raise serializers.ValidationError(
                "This username is already taken."
            )

        return value

    def validate_email(self, value):

        if User.objects.filter(
            email__iexact=value
        ).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    def validate_password(self, value):

        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long."
            )

        if not re.search(r'[a-zA-Z]', value):
            raise serializers.ValidationError(
                "Password must contain at least one letter."
            )

        if not re.search(r'\d', value):
            raise serializers.ValidationError(
                "Password must contain at least one number."
            )

        if not re.search(
            r'[!@#$%^&*(),.?":{}|<>]',
            value
        ):
            raise serializers.ValidationError(
                "Password must contain at least one special character."
            )

        return value

    def create(self, validated_data):

        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )


# ============================================================
# PASSWORD RESET
# ============================================================

class PasswordResetRequestSerializer(
    serializers.Serializer
):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(
    serializers.Serializer
):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(
        write_only=True
    )


# ============================================================
# USER LIST / ADMIN PANEL
# ============================================================

class UserListSerializer(
    serializers.ModelSerializer
):

    role = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    total_expenses = serializers.SerializerMethodField()
    budget = serializers.SerializerMethodField()

    class Meta:
        model = User

        fields = [
            'id',
            'username',
            'email',
            'role',
            'status',
            'total_expenses',
            'budget',
        ]

    def get_role(self, obj):

        try:
            return obj.profile.role

        except UserProfile.DoesNotExist:
            return 'user'

    def get_status(self, obj):

        try:
            return (
                'active'
                if obj.profile.is_active
                else 'disabled'
            )

        except UserProfile.DoesNotExist:
            return 'active'

    def get_total_expenses(self, obj):

        total = obj.expenses.aggregate(
            total=Sum('amount')
        )['total']

        return total or 0

    def get_budget(self, obj):

        total = obj.budgets.aggregate(
            total=Sum('amount')
        )['total']

        return total or 0


# ============================================================
# NOTIFICATIONS
# ============================================================

class NotificationSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = Notification

        fields = [
            'id',
            'title',
            'message',
            'notification_type',
            'is_read',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'created_at',
        ]
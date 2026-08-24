from rest_framework import viewsets, permissions
from .models import Expense, Category, Budget
from .serializers import ExpenseSerializer, CategorySerializer, BudgetSerializer
from .permissions import IsOwnerOrAdmin


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        user = self.request.user
        requested_user_id = self.request.query_params.get('user_id')

        if user.is_staff and requested_user_id:
            return Category.objects.filter(user_id=requested_user_id)

        return Category.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        user = self.request.user
        requested_user_id = self.request.query_params.get('user_id')

        if user.is_staff and requested_user_id:
            return Expense.objects.filter(user_id=requested_user_id).order_by('-date')

        return Expense.objects.filter(user=user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        user = self.request.user
        requested_user_id = self.request.query_params.get('user_id')

        if user.is_staff and requested_user_id:
            return Budget.objects.filter(user_id=requested_user_id).order_by('-month')

        return Budget.objects.filter(user=user).order_by('-month')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
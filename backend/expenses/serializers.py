from rest_framework import serializers
from .models import Expense, Category, Budget


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_name(self, value):
        user = self.context['request'].user
        if Category.objects.filter(user=user, name__iexact=value).exists():
            raise serializers.ValidationError("You already have a category with this name.")
        return value


class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Expense
        fields = ['id', 'amount', 'category', 'category_name', 'date', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Budget
        fields = ['id', 'category', 'category_name', 'amount', 'month', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate(self, data):
        user = self.context['request'].user
        category = data.get('category')
        month = data.get('month')

        existing = Budget.objects.filter(user=user, month=month)
        if category:
            existing = existing.filter(category=category)
        else:
            existing = existing.filter(category__isnull=True)

        if existing.exists():
            label = category.name if category else 'an overall'
            raise serializers.ValidationError(
                f"You already have {label if category else 'an overall'} budget for this month."
            )
        return data
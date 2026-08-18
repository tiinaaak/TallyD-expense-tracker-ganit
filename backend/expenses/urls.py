from rest_framework.routers import DefaultRouter
from .views import ExpenseViewSet, CategoryViewSet, BudgetViewSet

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'budgets', BudgetViewSet, basename='budget')

urlpatterns = router.urls
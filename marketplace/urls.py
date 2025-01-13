from django.urls import path
from .views import ProductListView, ProductDetailView, CartView, CartItemView

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/<int:item_id>/', CartItemView.as_view(), name='cart-item'),
]

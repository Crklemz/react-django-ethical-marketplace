from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from .models import Product, CartItem, Cart
from .serializers import ProductSerializer, CartItemSerializer, CartSerializer

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, world!"})

class ProductListView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductDetailView(APIView):
    """
    Retrieve, update, or delete a specific product.
    """
    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def put(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        product.delete()
        return Response({"message": "Product deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class CartView(APIView):
    def get(self, request):
        # Assuming you fetch the cart by user or session
        cart = Cart.objects.first()  # Replace with actual logic
        if not cart:
            return Response({"detail": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class CartItemView(APIView):
    def delete(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(id=item_id)
            cart_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(id=item_id)
            quantity = request.data.get('quantity')
            cart_item.quantity = quantity
            cart_item.save()
            serializer = CartItemSerializer(cart_item)
            return Response(serializer.data)
        except CartItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
class AddToCartView(APIView):
    def post(self, request):
        # Extract product_id and quantity from the request
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)  # Default quantity is 1

        try:
            # Fetch the cart (or create one if it doesn't exist)
            cart, _ = Cart.objects.get_or_create(id=1)  # Replace with user/session logic if needed

            # Fetch the product
            product = get_object_or_404(Product, id=product_id)

            # Check if the item is already in the cart
            cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
            if not created:
                cart_item.quantity += quantity  # Increment quantity if the item already exists
            else:
                cart_item.quantity = quantity  # Set quantity for a new item

            cart_item.save()  # Save the updated cart item

            # Return the updated cart
            serializer = CartSerializer(cart)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



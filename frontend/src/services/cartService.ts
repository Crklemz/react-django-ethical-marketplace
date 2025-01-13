import api from './api';

export const fetchCart = async () => {
    try {
        const response = await api.get('/cart/');
        console.log('Fetched cart data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
};

export const addToCart = async (productId: number, quantity: number) => {
    try {
        const response = await api.post('/cart/add/', { product_id: productId, quantity });
        console.log('Added to cart:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};

export const removeFromCart = async (cartItemId: number) => {
    try {
        await api.delete(`/cart/${cartItemId}/`);
        console.log(`Removed cart item with ID: ${cartItemId}`);
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
};

export const checkoutCart = async () => {
    try {
        const response = await api.post('/cart/checkout/');
        console.log('Checkout successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during checkout:', error);
        throw error;
    }
};

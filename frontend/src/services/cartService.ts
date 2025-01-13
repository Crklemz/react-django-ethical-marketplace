import api from './api';

export const fetchCart = async () => {
    try {
        const response = await api.get('/cart/'); // Adjust endpoint if necessary
        console.log('Fetched cart data:', response.data); // Debug the response
        return response.data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
};

export const addToCart = async (productId: number, quantity: number) => {
    try {
        const response = await api.post('/cart/add/', { product_id: productId, quantity });
        console.log('Added to cart:', response.data); // Debug response
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};

export const removeFromCart = async (cartItemId: number) => {
    await api.delete(`cart/${cartItemId}/`);
};

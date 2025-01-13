import api from './api';

export const fetchCart = async () => {
    const response = await api.get('cart/');
    return response.data;
};

export const addToCart = async (productId: number, quantity: number) => {
    const response = await api.post('cart/', { product: productId, quantity });
    return response.data;
};

export const removeFromCart = async (cartItemId: number) => {
    await api.delete(`cart/${cartItemId}/`);
};

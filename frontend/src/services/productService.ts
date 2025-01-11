import api from './api';

export const fetchProducts = async () => {
    try {
        const response = await api.get('products/'); // Update the endpoint as needed
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const fetchProductById = async (id: number) => {
    try {
        const response = await api.get(`products/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};


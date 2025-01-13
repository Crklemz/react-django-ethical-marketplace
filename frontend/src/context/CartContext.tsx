import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchCart, addToCart as addToCartAPI, removeFromCart as removeFromCartAPI, checkoutCart } from '../services/cartService';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
}

interface CartItem {
    id: number;
    product: Product;
    quantity: number;
}

interface CartContextProps {
    cart: CartItem[];
    addToCart: (productId: number, quantity: number) => Promise<void>;
    removeFromCart: (cartItemId: number) => Promise<void>;
    clearCart: () => void;
    checkout: () => Promise<void>;
    loading: boolean;
    error: string | null;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const syncCartWithBackend = async () => {
        setLoading(true);
        try {
            const updatedCart = await fetchCart();
            setCart(updatedCart.items || []); // Handle empty cart gracefully
        } catch (err) {
            setError('Failed to sync cart.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        syncCartWithBackend();
    }, []);

    const addToCart = async (productId: number, quantity: number) => {
        try {
            await addToCartAPI(productId, quantity);
            await syncCartWithBackend();
        } catch (error) {
            setError('Error adding to cart.');
        }
    };

    const removeFromCart = async (cartItemId: number) => {
        try {
            await removeFromCartAPI(cartItemId);
            await syncCartWithBackend();
        } catch (error) {
            setError('Error removing from cart.');
        }
    };

    const clearCart = () => {
        setCart([]);
    };

    const checkout = async () => {
        try {
            await checkoutCart();
            clearCart();
        } catch (error) {
            setError('Error during checkout.');
        }
    };

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, clearCart, checkout, loading, error }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

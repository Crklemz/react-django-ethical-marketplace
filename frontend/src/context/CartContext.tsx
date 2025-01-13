import React, { createContext, useContext, useState, ReactNode } from 'react';
import { addToCart as addToCartAPI } from '../services/cartService';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
}

interface CartItem extends Product {
    quantity: number;
}

interface CartContextProps {
    cart: CartItem[];
    addToCart: (product: Product) => Promise<void>;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = async (product: Product) => {
        try {
            const cartItem = await addToCartAPI(product.id, 1); // Call backend API
            setCart((prevCart) => {
                const existingItem = prevCart.find((item) => item.id === product.id);
                if (existingItem) {
                    return prevCart.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
                return [...prevCart, { ...product, quantity: cartItem.quantity }];
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const removeFromCart = (productId: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
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

import React, { useEffect, useState } from 'react';
import { fetchCart, addToCart, removeFromCart } from '../services/cartService';

interface CartItem {
    id: number;
    product: {
        id: number;
        name: string;
        price: number;
        description: string;
    };
    quantity: number;
}

const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCart = async () => {
            try {
                setLoading(true);
                const data = await fetchCart();
                setCartItems(data);
            } catch (err) {
                console.error('Failed to fetch cart:', err);
                setError('Failed to load cart. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, []);

    const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
        if (newQuantity <= 0) return; // Prevent invalid quantities

        try {
            await addToCart(cartItemId, newQuantity); // API may handle updating quantity
            setCartItems((prev) =>
                prev.map((item) =>
                    item.id === cartItemId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (err) {
            console.error('Failed to update cart item:', err);
            setError('Failed to update quantity. Please try again.');
        }
    };

    const handleRemove = async (cartItemId: number) => {
        try {
            await removeFromCart(cartItemId);
            setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
        } catch (err) {
            console.error('Failed to remove cart item:', err);
            setError('Failed to remove item. Please try again.');
        }
    };

    if (loading) return <p>Loading cart...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.id}>
                                <td>{item.product.name}</td>
                                <td>${item.product.price.toFixed(2)}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleQuantityChange(item.id, Number(e.target.value))
                                        }
                                    />
                                </td>
                                <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                                <td>
                                    <button onClick={() => handleRemove(item.id)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Cart;

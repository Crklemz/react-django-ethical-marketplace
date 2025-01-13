import React, { useEffect, useState } from 'react';
import { fetchCart, removeFromCart, checkoutCart } from '../services/cartService';

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

const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const loadCart = async () => {
            try {
                setLoading(true);
                const data = await fetchCart();
                setCartItems(data.items); // Ensure you extract "items" from the response
            } catch (err) {
                console.error('Failed to fetch cart:', err);
                setError('Failed to load cart. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, []);

    const handleRemove = async (cartItemId: number) => {
        try {
            await removeFromCart(cartItemId);
            setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
        } catch (err) {
            console.error('Failed to remove cart item:', err);
            setError('Failed to remove item. Please try again.');
        }
    };

    const handleCheckout = async () => {
        try {
            await checkoutCart(); // Call the checkout API
            setCartItems([]); // Clear the cart on the frontend
            setSuccessMessage('Checkout successful! Your cart has been cleared.');
        } catch (err) {
            console.error('Checkout failed:', err);
            setError('Checkout failed. Please try again.');
        }
    };

    if (loading) return <p>Loading cart...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Your Cart</h2>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Description</th>
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
                                    <td>{item.product.description}</td>
                                    <td>${item.product.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>${(item.product.price * item.quantity)}</td>
                                    <td>
                                        <button onClick={() => handleRemove(item.id)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={handleCheckout} style={{ marginTop: '20px' }}>
                        Checkout
                    </button>
                </>
            )}
        </div>
    );
};

export default Cart;

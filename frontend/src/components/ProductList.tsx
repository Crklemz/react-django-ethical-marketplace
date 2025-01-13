import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    const handleAddToCart = async (product: Product) => {
        try {
            await addToCart(product.id, 1);
            setSuccessMessage(`${product.name} has been added to the cart!`);
            setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3 seconds
        } catch (error) {
            console.error('Failed to add product to cart:', error);
            alert('Failed to add item to the cart. Please try again.');
        }
    };

    const handleGoToCart = () => {
        navigate('/cart'); // Navigate to the cart page
    };

    if (loading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Product List</h1>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {products.map((product) => (
                    <li key={product.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>${product.price}</p>
                        <button onClick={() => handleAddToCart(product)} style={{ marginRight: '10px' }}>
                            Add to Cart
                        </button>
                    </li>
                ))}
            </ul>
            <button
                onClick={handleGoToCart}
                style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007BFF', color: '#FFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                aria-label="Navigate to cart page"
            >
                Go to Cart
            </button>
        </div>
    );
};

export default ProductList;

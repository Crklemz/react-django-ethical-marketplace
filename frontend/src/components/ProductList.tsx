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
    const { addToCart } = useCart(); // Get addToCart from CartContext
    const navigate = useNavigate(); // Initialize useNavigate for navigation

    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    const handleGoToCart = () => {
        navigate('/cart'); // Navigate to the cart page
    };

    if (loading) {
        return <p>Loading products...</p>;
    }

    return (
        <div>
            <h1>Product List</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>${product.price}</p>
                        <button onClick={() => addToCart(product)}>Add to Cart</button>
                    </li>
                ))}
            </ul>
            <button onClick={handleGoToCart} style={{ marginTop: '20px' }}>
                Go to Cart
            </button>
        </div>
    );
};

export default ProductList;

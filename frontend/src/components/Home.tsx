import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/productService';

const Home: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };

        getProducts();
    }, []);

    return (
        <div>
            <h1>Welcome to Ethical Marketplace</h1>
            <h2>Products</h2>
            <ul>
                {products.map((product, index) => (
                    <li key={index}>{product.name}</li> // Update according to API response
                ))}
            </ul>
        </div>
    );
};

export default Home;

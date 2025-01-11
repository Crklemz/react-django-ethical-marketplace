import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../services/productService';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
}

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getProduct = async () => {
            try {
                if (id) {
                    const data = await fetchProductById(Number(id));
                    setProduct(data);
                }
            } catch (err) {
                setError('Failed to load product details');
            }
        };

        getProduct();
    }, [id]);

    if (error) return <p>{error}</p>;
    if (!product) return <p>Loading...</p>;

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>${product.price}</p>
        </div>
    );
};

export default ProductDetails;

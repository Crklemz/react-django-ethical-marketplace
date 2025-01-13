import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Products from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />

            </Routes>
        </Router>
    );
};

export default App;

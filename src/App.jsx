import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('laptops');
    const [n, setN] = useState(10);
    const [sortBy, setSortBy] = useState('rating');
    const [order, setOrder] = useState('desc');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, [category, n, sortBy, order, page]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/categories/${category}/products`, {
                params: { n, sortBy, order, page }
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Top Products</h1>
                <div>
                    <label>
                        Category:
                        <input type="text" value={category} onChange={e => setCategory(e.target.value)} />
                    </label>
                    <label>
                        Number of Products:
                        <input type="number" value={n} onChange={e => setN(e.target.value)} />
                    </label>
                    <label>
                        Sort By:
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            <option value="rating">Rating</option>
                            <option value="price">Price</option>
                            <option value="discount">Discount</option>
                            <option value="company">Company</option>
                        </select>
                    </label>
                    <label>
                        Order:
                        <select value={order} onChange={e => setOrder(e.target.value)}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </label>
                    <label>
                        Page:
                        <input type="number" value={page} onChange={e => setPage(e.target.value)} />
                    </label>
                </div>
                <div className="product-list">
                    {products.map(product => (
                        <div key={product.id} className="product-item">
                            <h2>{product.productName}</h2>
                            <p>Price: ${product.price}</p>
                            <p>Rating: {product.rating}</p>
                            <p>Discount: {product.discount}%</p>
                            <p>Availability: {product.availability}</p>
                        </div>
                    ))}
                </div>
            </header>
        </div>
    );
};

export default App;

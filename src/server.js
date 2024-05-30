const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const app = express();

const PORT = 3001;
const TEST_SERVER_URL = 'http://localhost:3001';

// Mock function to register with e-commerce companies
async function registerWithEcommerceCompanies() {
    // Assume registration is done here
}

// Middleware to register with companies on server start
app.use(async (req, res, next) => {
    await registerWithEcommerceCompanies();
    next();
});

// Get top N products in a category with optional sorting and pagination
app.get('/categories/:categoryname/products', async (req, res) => {
    const { categoryname } = req.params;
    const { n = 10, page = 1, sortBy = 'rating', order = 'desc' } = req.query;
    const limit = Math.min(n, 10);
    const offset = (page - 1) * limit;

    try {
        // Fetch products from each company
        const responses = await Promise.all([
            axios.get(`${TEST_SERVER_URL}/company1/categories/${categoryname}/products`),
            axios.get(`${TEST_SERVER_URL}/company2/categories/${categoryname}/products`),
            axios.get(`${TEST_SERVER_URL}/company3/categories/${categoryname}/products`),
            axios.get(`${TEST_SERVER_URL}/company4/categories/${categoryname}/products`),
            axios.get(`${TEST_SERVER_URL}/company5/categories/${categoryname}/products`)
        ]);

        // Combine and sort products
        let products = responses.flatMap(response => response.data);
        products.sort((a, b) => {
            if (order === 'asc') {
                return a[sortBy] - b[sortBy];
            } else {
                return b[sortBy] - a[sortBy];
            }
        });

        // Paginate
        const paginatedProducts = products.slice(offset, offset + limit);

        // Add unique ID to each product
        const result = paginatedProducts.map(product => ({ ...product, id: uuidv4() }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
});

// Get product details by ID
app.get('/categories/:categoryname/products/:productid', async (req, res) => {
    const { categoryname, productid } = req.params;

    try {
        // Fetch all products to find the specific product
        const responses = await Promise.all([
            axios.get(`${TEST_SERVER_URL}/company1/categories/${categoryname}/products`),
            axios.get(`${TEST_SERVER_URL}/company2/categories/${categoryname}/products`),
            axios.get(`${TEST_SERVER_URL}/company3/categories/${categoryname}/products`),
            axios.get(`${TEST_SERVER_URL}/company4/categories/${categoryname}/products`),
            axios.get(`${TEST_SERVER_URL}/company5/categories/${categoryname}/products`)
        ]);

        const products = responses.flatMap(response => response.data);
        const product = products.find(p => p.id === productid);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching product details' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { auth, JWT_SECRET } = require('./middleware/auth');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('.'));

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Database helper functions
async function readDB() {
    const data = await fs.readFile(path.join(__dirname, 'data', 'db.json'), 'utf8');
    return JSON.parse(data);
}

async function writeDB(data) {
    await fs.writeFile(
        path.join(__dirname, 'data', 'db.json'),
        JSON.stringify(data, null, 2)
    );
}

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const db = await readDB();
        res.json(db.products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Search and filter products
app.get('/api/products/search', async (req, res) => {
    try {
        const { query, minPrice, maxPrice, category } = req.query;
        const db = await readDB();
        
        let filtered = db.products;
        
        if (query) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.description.toLowerCase().includes(query.toLowerCase())
            );
        }
        
        if (minPrice) {
            filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
        }
        
        if (maxPrice) {
            filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
        }
        
        if (category) {
            filtered = filtered.filter(p => p.category === category);
        }
        
        res.json(filtered);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
});

// Upload product image
app.post('/api/products/:id/image', auth, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDB();
        
        const product = db.products.find(p => p.id === parseInt(id));
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        product.image = `/uploads/${req.file.filename}`;
        await writeDB(db);
        
        res.json({ success: true, imageUrl: product.image });
    } catch (error) {
        res.status(500).json({ error: 'Image upload failed' });
    }
});

// Newsletter signup
app.post('/api/newsletter', async (req, res) => {
    try {
        const { email } = req.body;
        const db = await readDB();
        
        if (db.newsletter_subscribers.includes(email)) {
            return res.status(400).json({ error: 'Already subscribed' });
        }
        
        db.newsletter_subscribers.push(email);
        await writeDB(db);
        
        res.json({ success: true, message: 'Successfully subscribed!' });
    } catch (error) {
        res.status(500).json({ error: 'Subscription failed' });
    }
});

// Create order
app.post('/api/orders', async (req, res) => {
    try {
        const { userId, products, totalAmount } = req.body;
        const db = await readDB();
        
        const order = {
            id: Date.now(),
            userId,
            products,
            totalAmount,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        db.orders.push(order);
        await writeDB(db);
        
        res.json({ success: true, orderId: order.id });
    } catch (error) {
        res.status(500).json({ error: 'Order creation failed' });
    }
});

// Get user orders
app.get('/api/orders/user', auth, async (req, res) => {
    try {
        const db = await readDB();
        const userOrders = db.orders.filter(order => order.userId === req.user.userId);
        res.json(userOrders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Update order status
app.patch('/api/orders/:id/status', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const db = await readDB();
        
        const order = db.orders.find(o => o.id === parseInt(id));
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        order.status = status;
        await writeDB(db);
        
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

// User login
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = await readDB();
        
        const user = db.users.find(u => u.email === email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// User registration
app.post('/api/users/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const db = await readDB();
        
        if (db.users.some(user => user.email === email)) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            id: Date.now(),
            name,
            email,
            password: hashedPassword
        };
        
        db.users.push(user);
        await writeDB(db);
        
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        res.json({ success: true, userId: user.id, token });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
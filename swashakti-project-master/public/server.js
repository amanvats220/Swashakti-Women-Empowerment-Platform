import express from 'express';
import cors from 'cors';
import db from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));



// --- START COPY KARNA YHI SE ---

// Test route
app.get('/', (req, res) => {
  res.send('🚀 Swashakti Server is Running!');
});

// REGISTER ROUTE
app.post('/api/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, password, role], (err, result) => {
    if (err) {
      console.error('Error in register:', err);
      return res.status(500).json({ error: 'Email already exists or DB error' });
    }
    res.json({ message: 'Registration successful!' });
  });
});

// LOGIN ROUTE
app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ? AND role = ?';
  db.query(sql, [email, password, role], (err, results) => {
    if (err) {
      console.error('Error in login:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      res.json({ message: 'Login successful!', user: results[0] });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});
// User Delete Route
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Delete error' });
    }
    res.json({ message: 'User deleted!' });
  });
});

// User Update Route
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email, password, role } = req.body;
  db.query(
    'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
    [name, email, password, role, userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Update error' });
      }
      res.json({ message: 'User updated!' });
    }
  );
});
//product upload route
app.post('/api/products', (req, res) => {
  const { name, description, price, image_url, seller_id } = req.body;
  if (!name || !price || !seller_id) {
    return res.status(400).json({ error: 'Name, price, seller_id required!' });
  }
  db.query(
    'INSERT INTO products (seller_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?)',
    [seller_id, name, description, price, image_url],
    (err, result) => {
      if (err) {
        console.error('Product upload error:', err); // Important for error log!
        return res.status(500).json({ error: 'Product upload error' });
      }
      res.json({ message: 'Product uploaded!' });
    }
  );
});


// Products fetch route
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: 'Products fetch error' });
    res.json(results);
  });
});

// USERS GET ROUTE
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('❌ DB Query Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

//product_detail
// Add below existing routes in server.js

app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT p.*, u.name AS seller_name
    FROM products p
    JOIN users u ON p.seller_id = u.id
    WHERE p.id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('DB Error fetching product:', err);
      return res.status(500).json({ error: 'DB error' });
    }
    if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(results[0]);
  });
});

//orders proceed
app.get('/api/orders/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const sql = `
    SELECT o.id as order_id, o.total, o.created_at,
    oi.product_id, oi.quantity, oi.price,
    p.name as product_name, p.image_url
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ? ORDER BY o.created_at DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Order fetch error:', err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.json(results);
  });
});
// --- Orders Place Route (API) ---
app.post('/api/orders', (req, res) => {
  const { user_id, items, total } = req.body;
  if (!user_id || !items || !Array.isArray(items) || items.length === 0 || !total) {
    return res.status(400).json({ error: 'Order data missing!' });
  }

  // First, insert into orders table
  const orderSql = 'INSERT INTO orders (user_id, total) VALUES (?, ?)';
  db.query(orderSql, [user_id, total], (orderErr, orderResult) => {
    if (orderErr) {
      console.error('Order insert error:', orderErr);
      return res.status(500).json({ error: 'Order creation error' });
    }
    const orderId = orderResult.insertId;

    // Prepare bulk insert for order_items
    const itemSql = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';
    const values = items.map(item => [
      orderId, item.id, item.quantity, item.price
    ]);

    db.query(itemSql, [values], (itemErr, itemResult) => {
      if (itemErr) {
        console.error('Order items insert error:', itemErr);
        return res.status(500).json({ error: 'Order items creation error' });
      }
      res.json({ message: 'Order placed!', orderId });
    });
  });
});

// --- Product Delete Route ---
app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.log('Delete error:', err); // <-- Debug ke liye
      return res.status(500).json({ error: 'Delete error' });
    }
    if (result.affectedRows > 0) {
      res.json({ message: 'Product deleted!' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });
});

app.put('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const { name, description, price, image_url } = req.body;
  db.query(
    'UPDATE products SET name=?, description=?, price=?, image_url=? WHERE id=?',
    [name, description, price, image_url, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Update error' });
      res.json({ message: 'Product updated!' });
    }
  );
});



// --- END YHA TAK ---

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

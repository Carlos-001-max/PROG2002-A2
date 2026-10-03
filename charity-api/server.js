const express = require('express');
const cors = require('cors');
const pool = require('./event_db');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Homepage API: Get all upcoming events
app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT e.*, c.name AS category_name, DATE_FORMAT(e.event_date, '%Y-%m-%d') AS event_date 
       FROM events e 
       JOIN categories c ON e.category_id = c.category_id 
       WHERE e.status = 'upcoming' 
       ORDER BY e.event_date ASC`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Search API: Filter by date, location, category
app.get('/api/events/search', async (req, res) => {
  const { date, location, categoryId } = req.query;
  let sql = `SELECT e.*, c.name AS category_name, DATE_FORMAT(e.event_date, '%Y-%m-%d') AS event_date 
             FROM events e 
             JOIN categories c ON e.category_id = c.category_id 
             WHERE e.status = 'upcoming'`;
  const params = [];
  
  if (date) { sql += ' AND e.event_date = ?'; params.push(date); }
  if (location) { sql += ' AND e.location LIKE ?'; params.push(`%${location}%`); }
  if (categoryId) { sql += ' AND e.category_id = ?'; params.push(categoryId); }
  
  try {
    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. Categories API: For the search page dropdown
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. Event Detail API: For the event detail page
app.get('/api/events/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT e.*, c.name AS category_name, o.name AS org_name, DATE_FORMAT(e.event_date, '%Y-%m-%d') AS event_date 
       FROM events e 
       JOIN categories c ON e.category_id = c.category_id 
       JOIN organisations o ON e.org_id = o.org_id 
       WHERE e.event_id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(process.env.PORT || 3000, () => console.log('Server running on port 3000'));
const express = require('express');
const router = express.Router();
const db = require('../db');

const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
};

// Get all tasks for user
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT t.*, r.name as repo_name FROM tasks t
       LEFT JOIN repositories r ON t.repo_id = r.id
       WHERE t.user_id = $1 ORDER BY t.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create task
router.post('/', requireAuth, async (req, res) => {
  const { title, description, status, priority, repo_id } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO tasks (user_id, repo_id, title, description, status, priority)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, repo_id || null, title, description, status || 'todo', priority || 'medium']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task status
router.patch('/:id', requireAuth, async (req, res) => {
  const { status, title, description, priority } = req.body;
  try {
    const result = await db.query(
      `UPDATE tasks SET
        status = COALESCE($1, status),
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        priority = COALESCE($4, priority),
        updated_at = NOW()
       WHERE id = $5 AND user_id = $6 RETURNING *`,
      [status, title, description, priority, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete task
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

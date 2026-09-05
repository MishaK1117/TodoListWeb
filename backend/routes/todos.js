import express from 'express';
import pool from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET all todos belonging to the logged-in user
router.get('/', protect, async (req, res) => {
    const todos = await pool.query(
        'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at ASC',
        [req.user.id]
    );

    res.json(todos.rows);
});

// CREATE a new todo for the logged-in user
router.post('/', protect, async (req, res) => {
    const { text } = req.body;

    if(!text) {
        return res.status(400).json({ message: 'Todo text is required' });
    }

    const newTodo = await pool.query(
        'INSERT INTO todos (user_id, text) VALUES ($1, $2) RETURNING *',
        [req.user.id, text]
    );

    res.status(201).json(newTodo.rows[0]);
});

// UPDATE a todo (text and/or completed) - only if it belongs to the logged-in user
router.put('/:id', protect, async (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;

    const existing = await pool.query(
        'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
        [id, req.user.id]
    );

    if(existing.rows.length === 0) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    const current = existing.rows[0];

    const updated = await pool.query(
        'UPDATE todos SET text = $1, completed = $2 WHERE id = $3 RETURNING *',
        [text ?? current.text, completed ?? current.completed, id]
    );

    res.json(updated.rows[0]);
});

// DELETE a todo - only if it belongs to the logged-in user
router.delete('/:id', protect, async (req, res) => {
    const { id } = req.params;

    const deleted = await pool.query(
        'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, req.user.id]
    );

    if(deleted.rows.length === 0) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted' });
});

export default router;

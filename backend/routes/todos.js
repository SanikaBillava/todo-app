const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// GET /api/todos/:userId - Return tasks sorted by priority (1 first)
router.get('/:userId', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.params.userId }).sort({ priority: 1 });
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /api/todos - Create task
router.post('/', async (req, res) => {
  try {
    const { text, priority, userId } = req.body;
    if (!text || !userId) {
      return res.status(400).json({ error: 'Text and userId are required' });
    }
    const todo = await Todo.create({
      text: text.trim(),
      priority: priority ?? 2,
      completed: false,
      userId,
    });
    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PUT /api/todos/:id - Update task
router.put('/:id', async (req, res) => {
  try {
    const { text, priority, completed } = req.body;
    const update = {};
    if (text !== undefined) update.text = text.trim();
    if (priority !== undefined) update.priority = priority;
    if (typeof completed === 'boolean') update.completed = completed;
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /api/todos/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = router;

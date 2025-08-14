const express = require('express');
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

// GET
router.get('/', async (req, res) => {
  const { search, category, priority, status } = req.query;
  const userId = req.user._id;
  const query = { user: userId };

  if (search) query.text = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  if (priority) query.priority = priority;
  if (status === 'completed') query.completed = true;
  else if (status === 'pending') query.completed = false;

  try {
    const todos = await Todo.find(query).sort({ dueDate: 1, createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching todos' });
  }
});

// CREATE
router.post('/', async (req, res) => {
  const { text, category, priority, dueDate, reminder } = req.body;
  const userId = req.user._id;
  try {
    const todo = new Todo({
      user: userId,
      text,
      category: category || 'Other',
      priority: priority || 'Medium',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      reminder: reminder ? new Date(reminder) : undefined,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create todo' });
  }
});

// TOGGLE COMPLETE
router.put('/:id/toggle', async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user._id;
  try {
    const todo = await Todo.findOne({ _id: todoId, user: userId });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update todo' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user._id;
  try {
    const deleted = await Todo.findOneAndDelete({ _id: todoId, user: userId });
    if (!deleted) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete todo' });
  }
});

module.exports = router;

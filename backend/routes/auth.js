const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/login - Find or create user and push timestamp to loginHistory
router.post('/login', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'Username is required' });
    }
    const trimmed = username.trim();
    let user = await User.findOne({ username: trimmed });
    if (!user) {
      user = await User.create({ username: trimmed, loginHistory: [] });
    }
    user.loginHistory.push(new Date());
    await user.save();
    res.json({
      _id: user._id,
      username: user.username,
      loginHistory: user.loginHistory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;

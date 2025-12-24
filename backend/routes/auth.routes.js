const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ================= LOGIN API =================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= REGISTER API =================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = new User({
      name,
      email,
      password,
      role
    });

    await newUser.save();

    res.status(201).json({ message: 'Registration successful' });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

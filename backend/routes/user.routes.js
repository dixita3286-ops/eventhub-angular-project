const express = require('express');
const router = express.Router();
const User = require('../models/User');

/* ================= GET ALL USERS ================= */
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password') // password hide
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

/* ================= GET USERS COUNT ================= */
router.get('/count', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (err) {
    res.status(500).json({ message: 'Failed to count users' });
  }
});

module.exports = router;

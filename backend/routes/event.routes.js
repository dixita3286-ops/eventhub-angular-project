const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// CREATE EVENT (Organizer)
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error creating event' });
  }
});

// GET ALL APPROVED EVENTS (Public + Student)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

module.exports = router;

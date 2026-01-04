const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

/* =====================================================
   POST : REGISTER FOR EVENT
   URL  : /api/registrations
===================================================== */
router.post('/', async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    if (!eventId || !userId) {
      return res.status(400).json({ message: 'eventId and userId required' });
    }

    const existing = await Registration.findOne({ eventId, userId });
    if (existing) {
      return res.status(409).json({
        message: 'Already registered for this event'
      });
    }

    const registration = new Registration({ eventId, userId });
    await registration.save();

    res.status(201).json({
      message: 'Registered successfully',
      registration
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =====================================================
   GET : REGISTRATIONS BY EVENT (ADMIN / ORGANIZER)
   URL : /api/registrations/event/:eventId
===================================================== */
router.get('/event/:eventId', async (req, res) => {
  try {
    const registrations = await Registration
      .find({ eventId: req.params.eventId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(registrations);

  } catch (err) {
    console.error('Fetch event registrations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =====================================================
   GET : STUDENT REGISTRATIONS
   URL : /api/registrations/student/:userId
===================================================== */
router.get('/student/:userId', async (req, res) => {
  try {
    const registrations = await Registration
      .find({ userId: req.params.userId })
      .populate('eventId');

    res.json(registrations);

  } catch (err) {
    console.error('Fetch registrations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =====================================================
   GET : ALL REGISTRATIONS (ADMIN OPTIONAL)
   URL : /api/registrations
===================================================== */
router.get('/', async (req, res) => {
  try {
    const registrations = await Registration
      .find()
      .populate('eventId')
      .populate('userId');

    res.json(registrations);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

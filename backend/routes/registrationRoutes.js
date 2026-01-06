const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Registration = require('../models/Registration');

/* =====================================================
   REGISTER STUDENT FOR EVENT
   POST /api/registrations
===================================================== */
router.post('/', async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    if (!eventId || !userId) {
      return res.status(400).json({ message: 'Missing data' });
    }

    // prevent duplicate registration
    const already = await Registration.findOne({ eventId, userId });
    if (already) {
      return res.status(409).json({ message: 'Already registered' });
    }

    const registration = new Registration({
      eventId,
      userId,
      status: 'registered'
    });

    await registration.save();

    res.status(201).json(registration);

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

/* =====================================================
   GET REGISTERED EVENTS FOR STUDENT
   GET /api/registrations/student/:userId
===================================================== */
router.get('/student/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const registrations = await Registration.find({ userId })
      .populate('eventId')   // 🔥 event details laviye
      .sort({ registeredAt: -1 });

    // frontend-friendly format
    const formatted = registrations.map(r => ({
      _id: r._id,
      eventId: r.eventId?._id,
      title: r.eventId?.title,
      category: r.eventId?.category,
      date: r.eventId?.date,
      venue: r.eventId?.venue,
      eventImage: r.eventId?.eventImage,
      registeredAt: r.registeredAt
    }));

    res.json(formatted);

  } catch (err) {
    console.error('Student registrations error:', err);
    res.status(500).json({ message: 'Failed to fetch registrations' });
  }
});

/* ================= GET REGISTERED STUDENTS BY EVENT ================= */
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    console.log('EVENT ID RECEIVED:', eventId);

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json([]);
    }

    const registrations = await Registration.find({
      eventId: new mongoose.Types.ObjectId(eventId)
    })
      .populate('userId', 'name email mobile')
      .sort({ registeredAt: -1 });

    console.log('REGISTRATIONS FOUND:', registrations.length);

   const formatted = registrations.map(r => ({
  name: r.userId?.name,
  email: r.userId?.email,
  status: r.status || 'registered',
  createdAt: r.registeredAt
}));

res.json(formatted);


  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

module.exports = router;

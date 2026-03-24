const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Registration = require('../models/Registration');

const multer = require('multer');
const path = require('path');

/* ================= MULTER SETUP ================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

/* =====================================================
   REGISTER STUDENT FOR EVENT (WITH PAYMENT PROOF)
===================================================== */

router.post('/', upload.single('paymentProof'), async (req, res) => {
  try {

    const { eventId, userId, amount, method } = req.body;

    if (!eventId || !userId) {
      return res.status(400).json({ message: 'Missing data' });
    }

    const already = await Registration.findOne({ eventId, userId });
    if (already) {
      return res.status(409).json({ message: 'Already registered' });
    }

    /* ================= FREE EVENT ================= */

    if (method === 'free') {

      const registration = new Registration({
        eventId,
        userId,
        amount: 0,
        method: 'free',
        status: 'approved'
      });

      await registration.save();

      return res.status(201).json({ message: 'Free registered' });
    }

    /* ================= PAID EVENT ================= */

    if (!req.file) {
      return res.status(400).json({ message: 'Screenshot required' });
    }

    const registration = new Registration({
      eventId,
      userId,
      amount,
      method,
      paymentProof: req.file.filename,
      status: 'pending'
    });

    await registration.save();

    res.status(201).json({ message: 'Submitted for verification' });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

/* ================= GET STUDENT REGISTRATIONS ================= */

router.get('/student/:userId', async (req, res) => {
  try {
    const registrations = await Registration.find({
      userId: req.params.userId
    })
      .populate('eventId')
      .sort({ registeredAt: -1 });

    res.json(registrations);

  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

/* ================= GET EVENT STUDENTS ================= */

router.get('/event/:eventId', async (req, res) => {
  try {

    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json([]);
    }

    const registrations = await Registration.find({
      eventId: new mongoose.Types.ObjectId(eventId)
    })
      .populate('userId', 'name email mobile')
      .populate('eventId', 'title date venue eventImage registrationFee')
      .sort({ registeredAt: -1 });

    // 🔥 IMPORTANT FIX (UI mate perfect data)
    const formatted = registrations.map((r, index) => ({
      _id: r._id,

      // 🔥 USER DATA
      name: r.userId?.name || 'No Name',
      email: r.userId?.email || 'No Email',

      // 🔥 DATE FIX
      registeredAt: r.registeredAt,

      // 🔥 EXTRA (future use)
      status: r.status,
      paymentProof: r.paymentProof,
      rejectReason: r.rejectReason || ''
    }));

    res.json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

/* ================= DELETE ================= */

router.delete('/:id', async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid registration id' });
    }

    await Registration.findByIdAndDelete(id);

    res.json({ message: 'Registration cancelled successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to cancel registration' });
  }
});

/* ================= APPROVE ================= */

router.put('/approve/:id', async (req, res) => {
  try {

    await Registration.findByIdAndUpdate(req.params.id, {
      status: 'approved',
      rejectReason: ''
    });

    res.json({ message: 'Approved' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
});

/* ================= REJECT ================= */

router.put('/reject/:id', async (req, res) => {
  try {

    const { reason } = req.body;

    await Registration.findByIdAndUpdate(req.params.id, {
      status: 'rejected',
      rejectReason: reason
    });

    res.json({ message: 'Rejected' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
});

/* ================= ADMIN - GET ALL PAYMENTS ================= */

router.get('/payments', async (req, res) => {
  try {

    const data = await Registration.find()
      .populate('userId', 'name email')
      .populate('eventId', 'title');

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

module.exports = router;
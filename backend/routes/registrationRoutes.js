const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Registration = require('../models/Registration');

const multer = require('multer');
const path = require('path');

/* ================= MULTER SETUP ================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images'); // 👈 taro folder
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

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!eventId || !userId) {
      return res.status(400).json({ message: 'Missing data' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Screenshot required' });
    }

    // prevent duplicate
    const already = await Registration.findOne({ eventId, userId });
    if (already) {
      return res.status(409).json({ message: 'Already registered' });
    }

    const registration = new Registration({
      eventId,
      userId,
      amount,
      method,
      paymentProof: req.file.filename,
      status: 'pending'   // 🔥 change
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
      .sort({ registeredAt: -1 });

    const formatted = registrations.map(r => ({
  _id: r._id,
  name: r.userId?.name,
  email: r.userId?.email,
  status: r.status || 'pending',

  // 🔥 IMPORTANT (THIS LINE MUST BE THERE)
  paymentProof: r.paymentProof,

  // 🔥 EVENT
  event: r.eventId,

  createdAt: r.registeredAt
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
      status: 'approved'
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

    await Registration.findByIdAndUpdate(req.params.id, {
      status: 'rejected'
    });

    res.json({ message: 'Rejected' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
});

module.exports = router;
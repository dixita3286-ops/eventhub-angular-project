const express = require('express');
const router = express.Router();

const Payment = require('../models/Payment');

/* ================= GET ALL ================= */
router.get('/', async (req, res) => {
  const payments = await Payment.find().populate('user');
  res.json(payments);
});

/* ================= APPROVE ================= */
router.patch('/approve/:id', async (req, res) => {
  await Payment.findByIdAndUpdate(req.params.id, {
    status: 'approved'
  });
  res.json({ message: 'Approved' });
});

/* ================= REJECT ================= */
router.patch('/reject/:id', async (req, res) => {
  const { reason } = req.body;

  await Payment.findByIdAndUpdate(req.params.id, {
    status: 'rejected',
    rejectReason: reason
  });

  res.json({ message: 'Rejected' });
});

module.exports = router;
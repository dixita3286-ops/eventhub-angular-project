const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  amount: Number,
  method: String,

  // 🔥 IMPORTANT
  paymentProof: String,

  status: {
    type: String,
    enum: ['registered', 'pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },

  registeredAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Registration', registrationSchema);
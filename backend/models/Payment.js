const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  amount: Number,
  screenshot: String,
  status: {
    type: String,
    default: 'pending'
  },
  rejectReason: String
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
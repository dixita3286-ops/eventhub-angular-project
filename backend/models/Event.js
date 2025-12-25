const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    enum: ['Seminar', 'Cultural', 'Sports', 'Social', 'Exhibition'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  registrationFee: {
    type: Number,
    required: true
  },
  eventFile: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);

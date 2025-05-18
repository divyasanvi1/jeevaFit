// models/Tracking.js
const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  triggeredLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  thresholdDistance: {
    type: Number,
    default: 500, // Default to 500 meters if not provided
  },
  active: {
    type: Boolean,
    default: true,
  },
  emailSentAt: {
    type: Date, // null if not yet sent
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Tracking', trackingSchema);

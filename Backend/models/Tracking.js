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
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Tracking', trackingSchema);

// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  hospitalPlaceId: String,
  hospitalName: String,
  doctorName: String,
  reason: String,
  date: String,
  timeSlot: String,
  status: { type: String, default: "Confirmed" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);

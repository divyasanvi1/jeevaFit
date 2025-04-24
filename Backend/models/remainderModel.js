// models/Reminder.js
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
  time: { type: String, required: true }, // e.g., "09:30"
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  email: { type: String, required: true },
  sentDates: [{ type: String }], // e.g., ["2025-04-23"]
});

module.exports = mongoose.model("Reminder", reminderSchema);

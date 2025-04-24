const Reminder = require('../models/remainderModel');
const moment = require('moment'); // For date manipulation
const validator = require('validator'); // For email validation

// Create a new reminder
const createReminder = async (req, res) => {
  try {
    const { userId, reason, time, startDate, endDate, email } = req.body;

    // Validate all fields are provided
    if (!userId || !reason || !time || !startDate || !endDate || !email) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Ensure that startDate and endDate are in valid date format
    const start = moment(startDate, 'YYYY-MM-DD', true); // strict parsing
    const end = moment(endDate, 'YYYY-MM-DD', true); // strict parsing

    if (!start.isValid() || !end.isValid()) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    const dates = [];
    for (let currentDate = start; currentDate.isBefore(end) || currentDate.isSame(end); currentDate.add(1, 'days')) {
      dates.push(currentDate.format('YYYY-MM-DD'));
    }

    // Create a reminder for each date in the range
    const reminders = dates.map((date) => {
      return new Reminder({
        userId,
        reason,
        time,
        startDate: date,
        endDate,
        email,
        sentDates: [], // Initially, no dates are sent
      });
    });

    // Insert all reminders into the database
    await Reminder.insertMany(reminders);
    console.log("Reminders saved to database");

    // Return response
    res.status(201).json({ message: "Reminders scheduled!", reminders });
  } catch (err) {
    console.error("Error creating reminder:", err.message);
    res.status(500).json({ message: "Failed to schedule reminder", error: err.message });
  }
};

// Get all reminders for a user
const getUserReminders = async (req, res) => {
  try {
    const { userId } = req.params;
    const reminders = await Reminder.find({ userId }).sort({ time: 1 });
    res.status(200).json(reminders);
  } catch (err) {
    console.error("Error fetching reminders:", err.message);
    res.status(500).json({ message: "Failed to fetch reminders", error: err.message });
  }
};

// Delete a reminder
const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    await Reminder.findByIdAndDelete(id);
    res.status(200).json({ message: "Reminder deleted successfully" });
  } catch (err) {
    console.error("Error deleting reminder:", err.message);
    res.status(500).json({ message: "Failed to delete reminder", error: err.message });
  }
};

// Update a reminder
const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, time, email } = req.body;

    const updated = await Reminder.findByIdAndUpdate(
      id,
      { reason, time, email },
      { new: true }
    );

    res.status(200).json({ message: "Reminder updated", updated });
  } catch (err) {
    console.error("Error updating reminder:", err.message);
    res.status(500).json({ message: "Failed to update reminder", error: err.message });
  }
};

module.exports = {
  createReminder,
  getUserReminders,
  deleteReminder,
  updateReminder
};

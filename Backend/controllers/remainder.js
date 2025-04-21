const Reminder = require('../models/remainderModel');

// Create a new reminder
const createReminder = async (req, res) => {
  try {
    const { userId, reason, time, email } = req.body;

    if (!userId || !reason || !time || !email) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const reminder = new Reminder({
      userId,
      reason,
      time,
      email,
      isSent: false
    });

    await reminder.save();
    res.status(201).json({ message: "Reminder scheduled!", reminder });
  } catch (err) {
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
    res.status(500).json({ message: "Failed to update reminder", error: err.message });
  }
};

module.exports = {
  createReminder,
  getUserReminders,
  deleteReminder,
  updateReminder
};

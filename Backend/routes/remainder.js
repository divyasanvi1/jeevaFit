// routes/reminder.js
const express = require("express");
const Reminder = require("../models/Reminder");
const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { userId, reason, time, email } = req.body;
    const reminder = new Reminder({ userId, reason, time, email });
    await reminder.save();
    res.status(201).json({ message: "Reminder scheduled!", reminder });
  } catch (err) {
    res.status(500).json({ message: "Failed to schedule reminder", error: err.message });
  }
});

module.exports = router;

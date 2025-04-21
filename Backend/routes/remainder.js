// routes/reminder.js
const express = require('express');
const router = express.Router();
const {
  createReminder,
  getUserReminders,
  deleteReminder,
  updateReminder
} = require('../controllers/remainder');

router.post('/create', createReminder);
router.get('/:userId', getUserReminders);
router.delete('/:id', deleteReminder);
router.put('/:id', updateReminder);

module.exports = router;


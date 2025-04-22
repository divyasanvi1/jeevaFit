// controllers/booking.js
const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  try {
    const { userId, hospitalPlaceId, hospitalName, doctorName, date, timeSlot, reason } = req.body;
    const booking = new Booking({ userId, hospitalPlaceId, hospitalName, doctorName, date, timeSlot, reason });
    await booking.save();
    res.status(201).json({ message: "Booking confirmed", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createBooking, getUserBookings };

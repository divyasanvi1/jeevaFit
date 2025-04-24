// controllers/trackingController.js
const Tracking = require('../models/Tracking');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

const RADIUS = 500; // 500 meters

// Setup mail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Haversine formula
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000;
};

// Start tracking
const startTracking = async (req, res) => {
  const { userId, location } = req.body;
  if (!userId || !location?.lat || !location?.lng) {
    return res.status(400).json({ error: 'Missing data' });
  }

  const tracking = new Tracking({
    userId,
    triggeredLocation: location
  });

  await tracking.save();
  res.status(201).json({ message: 'Tracking started', tracking });
};

// Update location (periodic call)
const updateLocation = async (req, res) => {
  const { userId, currentLocation } = req.body;
  if (!userId || !currentLocation?.lat || !currentLocation?.lng) {
    return res.status(400).json({ error: 'Missing data' });
  }

  const tracking = await Tracking.findOne({ userId, active: true });
  if (!tracking) return res.status(404).json({ error: 'No active tracking found' });

  const distance = calculateDistance(
    tracking.triggeredLocation.lat,
    tracking.triggeredLocation.lng,
    currentLocation.lat,
    currentLocation.lng
  );

  if (distance > RADIUS) {
    const user = await User.findById(userId);
    if (user?.emergencyContactEmail) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.emergencyContactEmail,
        subject: '🚨 SOS Location Alert',
        text: `User ${user.name} moved beyond safe zone.\nLocation: https://maps.google.com?q=${currentLocation.lat},${currentLocation.lng}`
      });
    }

    tracking.active = false;
    await tracking.save();
  }

  res.status(200).json({ message: 'Location updated', distance });
};

module.exports = { startTracking, updateLocation };

// controllers/trackingController.js
const Tracking = require('../models/Tracking');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

//const RADIUS = 500; // 500 meters

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
  const { userId, location, thresholdDistance = 500 } = req.body;
  if (!userId || !location?.lat || !location?.lng) {
    return res.status(400).json({ error: 'Missing data' });
  }
  await Tracking.updateMany({ userId, active: true }, { active: false });
  const tracking = new Tracking({
    userId,
    triggeredLocation: location,
    thresholdDistance
  });

  await tracking.save();
  res.status(201).json({ message: 'Tracking started', tracking });
};
const stopTracking = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  const tracking = await Tracking.findOne({ userId, active: true });
  if (!tracking) return res.status(404).json({ error: 'No active tracking found' });

  tracking.active = false;
  await tracking.save();

  res.status(200).json({ message: 'Tracking stopped successfully' });
};
// Get current tracking status
const getTrackingStatus = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  const tracking = await Tracking.findOne({ userId, active: true });
  if (!tracking) return res.status(200).json({ active: false });

  res.status(200).json({ active: true, tracking });
};

// Update location (periodic call)
const updateLocation = async (req, res) => {
  const { userId, currentLocation } = req.body;
  if (!userId || !currentLocation?.lat || !currentLocation?.lng) {
    console.log('Missing required data');
    return res.status(400).json({ error: 'Missing data' });
  }

  const tracking = await Tracking.findOne({ userId, active: true });
  if (!tracking) {
    console.log('No active tracking found for user:', userId);
    return res.status(404).json({ error: 'No active tracking found' });
  }
  console.log('Active tracking:', tracking);
  const distance = calculateDistance(
    tracking.triggeredLocation.lat,
    tracking.triggeredLocation.lng,
    currentLocation.lat,
    currentLocation.lng
  );
  const threshold = tracking.thresholdDistance || 500;
  console.log(`Distance: ${distance} Threshold: ${threshold}`);

  if (distance >threshold) {
    console.log('Threshold exceeded, checking user email...');
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found!');
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('User email:', user.emergencyContactEmail);
    if (user?.emergencyContactEmail) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.emergencyContactEmail,
        subject: '🚨 SOS Location Alert',
        text: `User ${user.name} moved beyond safe zone.\nLocation: https://maps.google.com?q=${currentLocation.lat},${currentLocation.lng}`
      });
      tracking.emailSentAt = new Date();
    }

    tracking.active = false;
    await tracking.save();
  }

  res.status(200).json({ message: 'Location updated', distance,  emailSentAt: tracking.emailSentAt || null });
};

module.exports = { startTracking, updateLocation, stopTracking, getTrackingStatus };

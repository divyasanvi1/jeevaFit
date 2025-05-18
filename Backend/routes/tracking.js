// routes/trackingRoutes.js
const express = require('express');
const router = express.Router();
const { startTracking, updateLocation, stopTracking, getTrackingStatus } = require('../controllers/tracking');

router.post('/start', startTracking);
router.post('/update', updateLocation);
router.post('/stop', stopTracking);
router.get('/status', getTrackingStatus);

module.exports = router;

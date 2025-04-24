// routes/trackingRoutes.js
const express = require('express');
const router = express.Router();
const { startTracking, updateLocation } = require('../controllers/tracking');

router.post('/start', startTracking);
router.post('/update', updateLocation);

module.exports = router;

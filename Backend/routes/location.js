const express = require('express');
const router = express.Router();
const { handleNearbyHospitals } = require('../controllers/location');

router.post('/hospitals', handleNearbyHospitals);

module.exports = router;

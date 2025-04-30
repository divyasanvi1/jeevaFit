const express = require('express');
const router = express.Router();
const { saveVitals } = require('../controllers/bluetoothData');
const {restrictToLoggedInUserOnly} = require('../middleware/auth'); // Ensure userId is set

router.post('/save', restrictToLoggedInUserOnly, saveVitals);

module.exports = router;

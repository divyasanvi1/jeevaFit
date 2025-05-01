const express = require('express');
const router = express.Router();
const { predictRiskLive } = require('../controllers/riskPrediction');

// Route for live risk prediction
router.post('/predict-risk-live', predictRiskLive);

module.exports = router;

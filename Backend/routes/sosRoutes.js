const express = require('express');
const router = express.Router();
const { sendSOS } = require('../controllers/sos');

// POST /api/sos
router.post('/sos', sendSOS);

module.exports = router;

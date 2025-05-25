const express = require('express');
const router = express.Router();
const { sendResetLink } = require('../controllers/ForgotPassword');
const { resetPassword } = require('../controllers/resetPassword');

router.post('/forgot-password', sendResetLink);
router.post('/reset-password', resetPassword);

module.exports = router;

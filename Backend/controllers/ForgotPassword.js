const User = require('../models/userModel');
const ResetToken = require('../models/resetToken');
const crypto = require('crypto');
const sendEmail = require('../service/passwordSendEmail'); // You need to create this util

exports.sendResetLink = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingToken = await ResetToken.findOne({ userId: user._id });
    if (existingToken) await existingToken.deleteOne();

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour

    await new ResetToken({ userId: user._id, token, expiresAt }).save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await sendEmail(
      user.email,
      'Password Reset Request',
      `Click this link to reset your password: ${resetLink}`
    );

    res.status(200).json({ message: 'Reset link sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

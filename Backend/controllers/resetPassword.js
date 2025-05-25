const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const ResetToken = require('../models/resetToken');

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const resetRecord = await ResetToken.findOne({ token });
    if (!resetRecord || resetRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Token is invalid or expired' });
    }

    const user = await User.findById(resetRecord.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await resetRecord.deleteOne();

    res.status(200).json({ message: 'Password reset successful!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

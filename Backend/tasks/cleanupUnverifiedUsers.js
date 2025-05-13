const cron = require('node-cron');
const User = require('../models/userModel');  // Adjust the path to where your User model is located

// Run the cron job every hour
cron.schedule('0 * * * *', async () => { // This will run at the start of every hour
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);  // 1 hour ago

    // Find and delete unverified users created more than 1 hour ago
    const result = await User.deleteMany({
      isVerified: false,
      createdAt: { $lt: oneHourAgo }
    });

    if (result.deletedCount > 0) {
      console.log(`[CRON] Deleted ${result.deletedCount} unverified users.`);
    } else {
      console.log('[CRON] No unverified users to delete.');
    }
  } catch (err) {
    console.error('[CRON ERROR] Failed to delete unverified users:', err);
  }
});

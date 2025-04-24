const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Reminder = require("../models/remainderModel");
require("dotenv").config(); // Load environment variables
const moment = require("moment-timezone"); // Add this at the top


// Set up the email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
console.log('Email user:', process.env.EMAIL_USER);
console.log('Email password:', process.env.EMAIL_PASS);  // Be cautious with printing sensitive data


// Function to send email reminders
const sendReminderEmail = async (reminder) => {
  try {
    console.log('Sending email reminder:', reminder);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reminder.email,
      subject: "⏰ Medical Reminder",
      text: `Hi! This is a reminder: ${reminder.reason}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Mark reminder as sent
    
   // console.log(`Reminder sent to ${reminder.email} for: ${reminder.reason}`);
  } catch (err) {
    console.error("Error sending email:", err.message);
  }
};
console.log("Starting the cron job...");
// Schedule the task to run every minute (adjust as needed)
cron.schedule("* * * * *", async () => {
  const now = moment().tz("Asia/Kolkata"); // Set the correct timezone (adjust as needed)
  const todayStr = now.toISOString().split("T")[0]; // e.g., "2025-04-23"
  const currentTime = now.format("HH:mm"); // Correctly gets "19:41"
 // e.g., "09:30"

 // console.log("Current time:", currentTime); // Add this to your cron job

  try {
    const remindersQuery = {
      startDate: { $lte: now.toDate() },
      endDate: { $gte: now.toDate() },
      $or: [
        { time: currentTime }, // string format for exact match
        {
          time: {
            $gte: moment(now).startOf('minute').toDate(),
            $lt: moment(now).add(1, 'minute').toDate(),
          },
        },
      ],
    };
    
    const reminders = await Reminder.find(remindersQuery);
  //  console.log("Reminders fetched:", reminders);
    // Send an email for each reminder
    for (const reminder of reminders) {
      if (!reminder.sentDates.includes(todayStr)) {
        await sendReminderEmail(reminder);
        reminder.sentDates.push(todayStr);
        await reminder.save();
      }
    }
  } catch (err) {
    console.error("Scheduler error:", err.message);
  }
});

console.log("Reminder scheduler is running...");

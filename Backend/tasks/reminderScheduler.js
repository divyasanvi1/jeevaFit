const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Reminder = require("../models/remainderModel");
require("dotenv").config(); // Load environment variables

// Set up the email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  
});

// Function to send email reminders
const sendReminderEmail = async (reminder) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reminder.email,
      subject: "⏰ Medical Reminder",
      text: `Hi! This is a reminder: ${reminder.reason}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Mark reminder as sent
    reminder.isSent = true;
    await reminder.save();

    console.log(`Reminder sent to ${reminder.email} for: ${reminder.reason}`);
  } catch (err) {
    console.error("Error sending email:", err.message);
  }
};

// Schedule the task to run every minute (adjust as needed)
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const currentTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes()
  );

  try {
    // Find reminders that are scheduled for the current time and haven't been sent yet
    const reminders = await Reminder.find({
      time: currentTime,
      isSent: false,
    });

    // Send an email for each reminder
    for (const reminder of reminders) {
      await sendReminderEmail(reminder);
    }
  } catch (err) {
    console.error("Error fetching reminders:", err.message);
  }
});

console.log("Reminder scheduler is running...");

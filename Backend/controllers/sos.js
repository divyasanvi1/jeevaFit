const nodemailer = require("nodemailer");
const SOS = require("../models/sosModel");
const User = require("../models/userModel"); // Import the User model
require("dotenv").config();
console.log("Email user:", process.env.EMAIL_USER);
console.log(
  "Email password:",
  process.env.EMAIL_PASS ? "Loaded ✅" : "❌ Not Loaded"
);

// Create a transporter for Gmail (use environment variables for sensitive info)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail email
    pass: process.env.EMAIL_PASS, // Your Gmail app password
  },
});

// The sendSOS function
const sendSOS = async (req, res) => {
  try {
    const { userId, location } = req.body;

    if (!userId || !location?.lat || !location?.lng) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fetch user details from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user has an emergency contact email and phone
    if (!user.emergencyContactEmail || !user.emergencyContactPhone) {
      return res
        .status(400)
        .json({ error: "User does not have emergency contact details" });
    }

    // Save the SOS alert to the database
    const sos = new SOS({
      userId,
      location,
    });

    await sos.save();
    console.log("🚨 SOS alert saved:", sos);
    // Check if user is inside any geofenced area

    // Prepare email content
    let subject = "🚨 SOS Emergency Alert";
    let emailBody = `An SOS alert was triggered by user: ${user.name} (${userId})
Location: https://www.google.com/maps?q=${location.lat},${location.lng}
Phone: ${user.emergencyContactPhone}
Blood Group: ${user.bloodGroup}
`;

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.emergencyContactEmail, // Send email to the user's emergency contact email
      subject,
      text: `An SOS alert was triggered by user: ${user.name} (${userId})\nLocation: https://www.google.com/maps?q=${location.lat},${location.lng}\nPhone: ${user.emergencyContactPhone}\nBlood Group: ${user.bloodGroup}\n\n`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log(
      `Emergency alert email sent for user ${userId} at location ${location.lat}, ${location.lng}`
    );

    res
      .status(200)
      .json({ message: "SOS alert sent successfully, email dispatched" });
  } catch (error) {
    console.error("SOS send error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Export the sendSOS function
module.exports = {
  sendSOS,
};

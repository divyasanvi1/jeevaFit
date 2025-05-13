const nodemailer = require('nodemailer');
require("dotenv").config();

// Setup Nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail',  // You can use a different email service
    auth: {
        user: process.env.EMAIL_USER,  // Replace with your email
        pass: process.env.EMAIL_PASS,  // Replace with your email password or app-specific password
    }
});

// Send email
const sendVerificationEmail = async (email, verificationLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Account Verification',
        html: `
            <p>Click the link below to verify your email:</p>
            <a href="${verificationLink}">Verify Email</a>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};

module.exports = { sendVerificationEmail };

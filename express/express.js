const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const nodemailer = require('nodemailer');

const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

// Twilio and Nodemailer setup
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Route to send OTP
app.post('/api/send-otp', (req, res) => {
  const { method, destination, otp } = req.body;

  if (!method || !destination || !otp) {
    return res.status(400).json({ message: 'Method, destination, and OTP are required.' });
  }

  if (method === 'email') {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: destination,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send OTP via email.' });
      }
      console.log('Email sent:', info.response);
      return res.status(200).json({ message: 'OTP sent via email successfully.' });
    });
  } else if (method === 'number') {
    twilioClient.messages
      .create({
        body: `Your OTP code is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: destination,
      })
      .then((message) => {
        console.log('SMS sent:', message.sid);
        return res.status(200).json({ message: 'OTP sent via SMS successfully.' });
      })
      .catch((error) => {
        console.error('Error sending SMS:', error);
        return res.status(500).json({ message: 'Failed to send OTP via SMS.' });
      });
  } else {
    return res.status(400).json({ message: 'Invalid OTP method.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

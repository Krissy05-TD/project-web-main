const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Create an Express app
const app = express();

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());
app.use(bodyParser.json());

// Configure Twilio
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// API endpoint to send OTP
// API endpoint to send OTP
app.post('/api/send-otp', async (req, res) => {
    const { method, destination, otp } = req.body;
  
    if (!method || !destination || !otp) {
      return res.status(400).json({ message: 'Method, destination, and OTP are required.' });
    }
  
    try {
      if (method === 'email') {
        // Send OTP via email
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
          } else {
            console.log('Email sent:', info.response);
            return res.status(200).json({ message: 'OTP sent via email successfully.' });
          }
        });
      } else if (method === 'number') {
        // Send OTP via SMS using Twilio
        twilioClient.messages
          .create({
            body: `Your OTP code is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
            to: destination, // User's phone number
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
    } catch (error) {
      console.error('Error in send-otp:', error);
      return res.status(500).json({ message: 'An error occurred while sending OTP.' });
    }
  });
  

// API route to send a message
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// API route to receive data
app.post('/api/data', (req, res) => {
  const { name } = req.body; // Extract 'name' from the request body
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }
  console.log(req.body);
  res.json({ message: `Hello, ${name}!` });
});

// API route to send notifications
app.post('/api/notify', (req, res) => {
  const { method, destination } = req.body;

  if (!method || !destination) {
    return res.status(400).json({ message: 'OTP method or destination missing.' });
  }

  console.log(`Sending Verification Code via ${method} to ${destination}`);
  // You can add additional logic here (e.g., send email or SMS)

  res.json({ message: `Verification Code sent via ${method} to ${destination}` });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

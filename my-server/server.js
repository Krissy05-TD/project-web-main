// Import the express module
const express = require('express');
const cors = require('cors');

// Create an Express app
const app = express();

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Define a port to run the server
const PORT = 5000;

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello, Node.js server is running!');
});

// API route to send a message
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

// API route to receive data
app.post('/api/data', (req, res) => {
    const { name } = req.body;
    res.json({ message: `Hello, ${name}!` });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

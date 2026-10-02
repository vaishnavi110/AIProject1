const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Base health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mini E-Commerce API is running',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Connect to MongoDB
connectDB();

module.exports = { app, server };

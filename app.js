const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./routes/bookingRoute');

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Mount booking routes
app.use('/api/bookings', bookingRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.url} not found`
  });
});

module.exports = app;

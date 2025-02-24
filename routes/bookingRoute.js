const express = require('express');
const router = express.Router();
const { bookNow, cancelBooking, getAllBookings } = require('../controllers/bookingController');
const Booking = require('../model/Booking');

// Test endpoint
router.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ 
    message: 'Booking API is working',
    timestamp: new Date().toISOString()
  });
});

router.get('/', (req, res) => {
  res.json({ 
    message: 'Booking routes are mounted',
    availableEndpoints: [
      { method: 'GET', path: '/test' },
      { method: 'POST', path: '/book' },
      { method: 'DELETE', path: '/cancel/:id' }
    ]
  });
});

router.post('/book', bookNow);
router.delete('/cancel/:id', cancelBooking);

// Add this new route
router.get('/user-bookings/:userId', async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { guest_id: req.params.userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Replace the previous all-bookings route with this
router.get('/all-bookings', getAllBookings);

module.exports = router;
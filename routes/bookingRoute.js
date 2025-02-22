const express = require('express');
const router = express.Router();
const { bookNow, cancelBooking } = require('../controllers/bookingController');

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

module.exports = router;
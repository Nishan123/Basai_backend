const express = require('express');

const router = express.Router();

const propertyController = require('../controllers/propertyController');
const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registerProperty', upload.array('images', 5), propertyController.registerProperty);
router.get('/viewAllProperty', propertyController.viewAllProperty);
router.get('/my-properties', authMiddleware, propertyController.viewUserProperties);

module.exports = router;
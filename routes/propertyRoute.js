const express = require('express');

const router = express.Router();

const propertyController = require('../controllers/propertyController');
const upload = require('../middleware/uploadMiddleware');

router.post('/registerProperty', upload.array('images', 5), propertyController.registerProperty);
router.get('/viewAllProperty', propertyController.viewAllProperty);

module.exports = router;
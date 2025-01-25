
const express = require('express')

const router = express.Router();

const propertyController = require('../controllers/propertyController')


router.post('/registerProperty', propertyController.registerProperty);
router.get('/viewAllProperty', propertyController.viewAllProperty);

module.exports = router;
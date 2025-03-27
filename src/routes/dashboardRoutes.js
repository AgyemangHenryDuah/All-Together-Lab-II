const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { uploadImage } = require('../controllers/imageController');

router.get('/', getDashboard);
router.post('/upload', uploadImage);

module.exports = router;
const express = require('express');
const router = express.Router();
const { viewImage, deleteImage } = require('../controllers/imageController');

router.get('/:id', viewImage);
router.post('/:id/delete', deleteImage);

module.exports = router;
const express = require('express');
const multer = require('multer');
const galleryController = require('../controllers/galleryController');

const router = express.Router();

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique file name
  }
});

const upload = multer({ storage: storage });

// Routes for gallery images
router.post('/add', upload.single('image'), galleryController.addGalleryImage);  // Add new gallery image
router.get('/', galleryController.getGalleryImages);  // Get all gallery images
router.get('/:id', galleryController.getGalleryImageById);  // Get gallery image by ID
router.put('/edit/:id', upload.single('image'), galleryController.editGalleryImage);  // Edit gallery image
router.delete('/:id', galleryController.deleteGalleryImage);  // Delete gallery image

module.exports = router;

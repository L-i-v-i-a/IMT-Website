const express = require('express');
const multer = require('multer');
const courseController = require('../controllers/courseController');

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique file name
  }
});

const upload = multer({ storage: storage });

// Routes for courses
router.post('/add', upload.single('image'), courseController.addCourse);  // Add new course
router.get('/', courseController.getCourses);  // Get all courses
router.get('/:id', courseController.getCourseById);  // Get course by ID
router.put('/edit/:id', upload.single('image'), courseController.editCourse);  
router.delete('/:id', courseController.deleteCourse);  // Delete course

module.exports = router;

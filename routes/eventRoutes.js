const express = require('express');
const multer = require('multer');
const eventController = require('../controllers/eventController');
const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage: storage });


router.post('/add', upload.single('image'), eventController.addEvent); 
router.get('/', eventController.getEvents); 
router.get('/:id', eventController.getEventById); 
router.put('/edit/:id', upload.single('image'), eventController.editEvent); 
router.delete('/:id', eventController.deleteEvent); 
router.get('/search', eventController.searchEvents); 

module.exports = router;

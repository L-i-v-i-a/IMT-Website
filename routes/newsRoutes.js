const express = require('express');
const multer = require('multer');
const newsController = require('../controllers/newsController');

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


router.post('/add', upload.single('image'), newsController.addNews);  
router.get('/', newsController.getNews);  
router.get('/:id', newsController.getNewsById);  
router.put('/edit/:id', upload.single('image'), newsController.editNews);
router.delete('/:id', newsController.deleteNews);  
module.exports = router;

const express = require('express');
const multer = require('multer');
const newsController = require('../controllers/newsController');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed.'));
    }
  },
});

module.exports = upload;


router.post('/add', upload.single('image'), newsController.addNews);  
router.get('/', newsController.getNews);  
router.get('/:id', newsController.getNewsById);  
router.put('/edit/:id', upload.single('image'), newsController.editNews);
router.delete('/:id', newsController.deleteNews);  
module.exports = router;

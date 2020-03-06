const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];

    let error = new Error("invalid mimetype");
    if (isValid) {
      error = null;
    }
    callback(error, "assets/pictures");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + ext);
  }
});


// router.post('/', UserController.utils);
router.post('/', multer({storage: storage}).single('image'),  UserController.signupValidation, UserController.createUser);

/* ----- Fallback function ----- */
router.use((req, res) => {
  res.send('Bad request to /signup');
});

module.exports = router;
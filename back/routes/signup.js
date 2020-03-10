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

    let error = null;
    if (!isValid) {
      error = new Error("invalid mimetype");
    }
    callback(error, "assets/pictures");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.replace("." + MIME_TYPE_MAP[file.mimetype], "").toLocaleLowerCase().replace(' ', '-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    req.body.avatar = name + '-' + Date.now() + '.' + ext;
    
    callback(null, req.body.avatar);
  }
});


// router.post('/', UserController.utils);
router.post('', multer({storage: storage}).single('photoUrl'), UserController.signupInputsValidation, UserController.createUser);

/* ----- Fallback function ----- */
router.use((req, res) => {
  res.send('Bad request to /signup');
});

module.exports = router;
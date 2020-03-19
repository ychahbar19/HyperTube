const express = require('express');
const multer = require('multer');

const UserController = require('../controllers/UserController');
const authCheck = require('../middleware/auth');

const router = express.Router();

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

// router.all('/', authCheck);
router.get('/', authCheck, UserController.getUserInfo);
router.post('/', authCheck, multer({storage: storage}).single('photoUrl'), UserController.updateUser, UserController.updateToken);
// , authCheck, UserController.getInfoById

router.use((req, res) => {
    res.send('bad request to /edit-profile');
});

module.exports = router;
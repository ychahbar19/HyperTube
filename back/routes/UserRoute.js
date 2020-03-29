/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const express = require('express');
const multer = require('multer');
const authCheck = require('../middleware/auth');
const UserController = require('../controllers/UserController');

/*
same as in AuthRoute --> to combine
*/
const MIME_TYPE_MAP =
{
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg'
};
const storage = multer.diskStorage(
  {
    destination: (req, file, callback) =>
    {
      let error = null;
      if (!MIME_TYPE_MAP[file.mimetype])
        error = new Error("invalid mimetype");
      callback(error, "assets/pictures");
  },
  filename: (req, file, callback) =>
  {
    const name = file.originalname.replace("." + MIME_TYPE_MAP[file.mimetype], "").toLocaleLowerCase().replace(' ', '-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    req.body.avatar = name + '-' + Date.now() + '.' + ext;
    callback(null, req.body.avatar);
  }
});

const router = express.Router();

/* ------------------------------------------------------------------------ *\
    2) Calls to the controller's functions based on the request type/route.
\* ------------------------------------------------------------------------ */

/* ----- User functions ----- */

router.post('/profile', authCheck, UserController.getUserInfo);
// , UserController.checkPassword(), UserController.updateUser());
// , authCheck, UserController.getInfoById

// router.all('/', authCheck);
router.get('/edit-profile', authCheck, UserController.getUserInfo);
router.post('/edit-profile', authCheck, multer({storage: storage}).single('photoUrl'), UserController.updateUser, UserController.updateToken);
// , authCheck, UserController.getInfoById

/* ----- Fallback function ----- */
router.use((req, res) =>
{
  res.send('Bad request to /api/user');
});

/* ------------------------------------------------------------------------ *\
    3) Exports the router.
\* ------------------------------------------------------------------------ */

module.exports = router;
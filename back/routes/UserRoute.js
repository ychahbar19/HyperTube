/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const express = require('express');
const multer = require('multer');
const authCheck = require('../middleware/auth');
const ImageController = require('../controllers/ImageController');
const UserController = require('../controllers/UserController');

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
router.post('/edit-profile', authCheck, multer({storage: ImageController.storage}).single('photoUrl'), UserController.updateUser, UserController.updateToken);
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
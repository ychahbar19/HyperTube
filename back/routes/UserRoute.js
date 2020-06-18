/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const express = require('express');
const multer = require('multer');
const authCheck = require('../middleware/auth');
const ImageController = require('../controllers/ImageController');
const AuthCtlr = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');

const router = express.Router();

/* ------------------------------------------------------------------------ *\
    2) Calls to the controller's functions based on the request type/route.
\* ------------------------------------------------------------------------ */

/* ----- User functions ----- */
router.get('/profile/:user_id?', authCheck, UserController.getUserInfo);
router.get('/editProfile', authCheck, UserController.getUserInfo);
router.post('/editProfile', authCheck, multer({storage: ImageController.storage}).single('photoUrl'), AuthCtlr.editInputsValidation, UserController.updateUser, UserController.updateToken);

/* ----- Fallback function ----- */
router.use((req, res) =>
{
  res.send('Bad request to /api/user');
});

/* ------------------------------------------------------------------------ *\
    3) Exports the router.
\* ------------------------------------------------------------------------ */

module.exports = router;
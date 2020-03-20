// EXPRESS ROUTER for User

/* -------------------------------------------------------------------------- *\
    1) Imports the required elements (node package + controller)
\* -------------------------------------------------------------------------- */

const express = require('express');
const UserController = require('../controllers/UserController');
const MailController = require('../controllers/MailController');

/* -------------------------------------------------------------------------- *\
    2) Creates the Router object.
\* -------------------------------------------------------------------------- */

const router = express.Router();

/* -------------------------------------------------------------------------- *\
    3) Calls the controller's functions based on the request's type & route.
\* -------------------------------------------------------------------------- */

//check
router.get('/', (req, res) => {
   res.json({ message: 'Req to /api/auth' });
});

// router.post('/signup', UserController.signup);
// router.post('/login', UserController.login);
router.post('/activateAccount', UserController.activateAccount);
router.post(
  '/forgotPassword',
  UserController.createRandomStr,
  MailController.sendResetPwd
);
router.post(
  '/resetPassword',
  UserController.checkIdAndHash,
  UserController.checkPassword,
  UserController.resetPwd
);

/* -------------------------------------------------------------------------- *\
    4) Exports the router.
\* -------------------------------------------------------------------------- */

module.exports = router;
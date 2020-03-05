// EXPRESS ROUTER for User

/* -------------------------------------------------------------------------- *\
    1) Imports the required elements (node package + controller)
\* -------------------------------------------------------------------------- */

const express = require('express');
const UserController = require('../controllers/UserController');
const passport = require('passport');

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

router.post(
  '/signup',
  UserController.signupValidation,
  UserController.createUser
);

router.post(
  '/login',
  UserController.loginValidation,
  UserController.login
);

router.get('/google', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
  });
});
// router.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   }
// );

/* ----- Fallback function ----- */
router.use((req, res) => {
  res.send('Bad request to /api/auth');
});

/* -------------------------------------------------------------------------- *\
    4) Exports the router.
\* -------------------------------------------------------------------------- */

module.exports = router;

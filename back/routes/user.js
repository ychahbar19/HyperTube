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

router.post('/userExists', UserController.userExists);

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

// router.get('/google', passport.authenticate('google', {
//   scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email']
// }));

// router.get('/google/redirect', (req, res) => {
  // console.log('okkkkkkkk');
  // var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
  // responseHTML = responseHTML.replace('%value%', JSON.stringify({
  //   user: req.user
  // }));
  // res.status(200).send(responseHTML);
// });

/* ----- Fallback function ----- */
router.use((req, res) => {
  res.send('Bad request to /api/auth');
});

/* -------------------------------------------------------------------------- *\
    4) Exports the router.
\* -------------------------------------------------------------------------- */

module.exports = router;

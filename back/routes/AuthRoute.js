/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const express = require('express');
const multer = require('multer');
const ImageController = require('../controllers/ImageController');
const AuthCtlr = require('../controllers/AuthController');
const MailCtlr = require('../controllers/MailController');
const passport = require('passport');

const failureRedirectURL = 'http://localhost:4200/signin';
const successRedirectURL = 'http://localhost:4200/';

const router = express.Router();

/* ------------------------------------------------------------------------ *\
    2) Defines the routes for each authentification strategy,
    and their custom callback function.
\* ------------------------------------------------------------------------ */

/* ----- Hypertube authentification ----- */

router.post('/signup', multer({storage: ImageController.storage}).single('photoUrl'), AuthCtlr.signupInputsValidation, AuthCtlr.createUser, MailCtlr.sendConfirmMail);
router.post('/activateAccount', AuthCtlr.activateAccount);
router.post('/signin', AuthCtlr.loginInputsValidation, AuthCtlr.login);
router.post('/forgotPassword', AuthCtlr.createRandomStr, MailCtlr.sendResetPwd);
router.post('/resetPassword', AuthCtlr.checkIdAndHash, AuthCtlr.checkPassword, AuthCtlr.resetPwd);

// ------ Common function for action on success with external auth provider  ------

function authSuccess(req, res, provider)
{
  const token = AuthCtlr.generateLogToken(req.user);

  console.log('provider: ', provider);
  console.log(token);
  /*
  //Save user info in the session
  let sessionContents = req.session;
  sessionContents.authStrategy = '42';
  sessionContents.authUserId = req.user.fortytwoId;
  */
  res.redirect(successRedirectURL);
};

/* ----- 42 authentification ----- */

router.get('/42', passport.authenticate('42'));
router.get('/42/callback', passport.authenticate('42',
{
  failureRedirect: failureRedirectURL //Redirect if failure
}),
function(req, res)
{
  return authSuccess(req, res, '42'); //Function if success
});

/* ----- Facebook authentification ----- */

router.get('/facebook', passport.authenticate('facebook', { scope : ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook',
{
  failureRedirect: failureRedirectURL
}),
function(req, res)
{
  return authSuccess(req, res, 'facebook');
});

/* ----- Google authentification ----- */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google',
{
  failureRedirect: failureRedirectURL
}),
function(req, res)
{
  return authSuccess(req, res, 'google');
});

/* ----- Fallback function ----- */
router.use((req, res) =>
{
   res.send('Bad request to /api/auth');
});

/* ------------------------------------------------------------------------ *\
    3) Exports the router.
\* ------------------------------------------------------------------------ */

module.exports = router;

/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const express = require('express');
const passport = require('passport');

const router = express.Router();

/* ------------------------------------------------------------------------ *\
    2) Defines the routes for each authentification strategy,
    and their custom callback function.
\* ------------------------------------------------------------------------ */

/* ----- Auth 42 ----- */
router.get('/42', passport.authenticate('42'));
router.get('/42/callback', passport.authenticate('42',
   //Redirect if failure: 
   { failureRedirect: 'http://localhost:4200/signin' }),
   //Function if success:
   function(req, res)
   {
       //Save user info in the session
       let sessionContents = req.session;
       sessionContents.authStrategy = '42';
       sessionContents.authUserId = req.user.fortytwoId;
       res.redirect('http://localhost:4200/');
   }
);

/* ----- Fallback function ----- */
router.use((req, res) =>
{
   res.send('Bad request to /api/authentification');
});

/* ------------------------------------------------------------------------ *\
    3) Exports the router.
\* ------------------------------------------------------------------------ */

module.exports = router;

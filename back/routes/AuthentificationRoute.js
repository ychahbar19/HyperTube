/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const express = require('express');
const passport = require('passport');
const Strategy42 = require('passport-42').Strategy;
const UserModel = require('../models/UserModel');
//const Auth42Controller = require('../controllers/Auth42Controller');

const router = express.Router();

/* ------------------------------------------------------------------------ *\
    2) Calls to the controller's functions based on the request type/route.
\* ------------------------------------------------------------------------ */

passport.serializeUser(function(user, done) { done(null, user.id); });
passport.deserializeUser(function(id, done)
{
    UserModel.findById(id, function (err, user) { done(err, user); });
});

/* ----- Auth 42 ----- */
passport.use(new Strategy42(
{
    clientID: "d4570548182bf2a5bfc57fa5c36fb0765188aded46627ae57f4859cdb0b05715",
    clientSecret: "92910a8897fe54a86e44cc40511cc7d00c2bde26552d2cd0a31d16f2c4fb704b",
    callbackURL: "http://localhost:3000/api/authentification/42/callback",
    profileFields:
    {
        'id': function (obj) { return String(obj.id); },
        'emails.0.value': 'email',
        'username': 'login',
        'photos.0.value': 'image_url',
        'name.givenName': 'first_name',
        'name.familyName': 'last_name'
    }
},
function(accessToken, refreshToken, profile, cb)
{
    UserModel.findOrCreate
    (
        { fortytwoId: profile.id },
        {
            email: profile.emails[0].value,
            username: profile.username,
            avatar: profile.photos[0].value,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            password: 'token?',
            fortytwoId: profile.id
        },
        function (err, user) { return cb(err, user); }
    );
}));

router.get('/42', passport.authenticate('42'));

router.get('/42/callback', passport.authenticate('42',
    { failureRedirect: '/api/authentification' }),
    function(req, res)
    {
        // Successful authentication, redirect to home
        res.redirect('/');
    }
);

/* ----- Fallback function ----- */
router.use((req, res) => {
   res.send('Bad request to /api/authentification');
});

/* ------------------------------------------------------------------------ *\
    3) Exports the router.
\* ------------------------------------------------------------------------ */

module.exports = router;

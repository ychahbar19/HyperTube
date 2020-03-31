/* ------------------------------------------------------------------------ *\
    Defines variables and functions for passport session.
\* ------------------------------------------------------------------------ */

const passport = require('passport');
const Strategy42 = require('passport-42').Strategy;
const UserModel = require('../models/UserModel');

// Function to allow serialization of the UserModel object
// (from the app, as it is sent by the strategy's callback function)
// into a user value (for the client cookie).      
passport.serializeUser(function(user_object, done)
{
  done(null, user_object.id);
});

// Function to allow deserialization of the user id
// (from the client, as it the cookie sent by the client's browser)
// into a UserModel object (for the app).
passport.deserializeUser(function(user_id, done)
{
  UserModel.findById
  (
    user_id,
    function (err, user)
    {
      done(err, user);
    }
  );
});

/* ------------------------------------------------------------------------ *\
    Defines passport strategies.
\* ------------------------------------------------------------------------ */

// ------ 42 authentification ------

passport.use(new Strategy42(
{
  //ID and secret defined at https://profile.intra.42.fr/oauth/applications/4260
  clientID: "d4570548182bf2a5bfc57fa5c36fb0765188aded46627ae57f4859cdb0b05715",
  clientSecret: "92910a8897fe54a86e44cc40511cc7d00c2bde26552d2cd0a31d16f2c4fb704b",
  callbackURL: "http://localhost:3000/api/auth/42/callback",
  profileFields:
  {
    'id': function (obj) { return String(obj.id); },
    'photos.0.value': 'image_url',
    'name.givenName': 'first_name',
    'name.familyName': 'last_name',
    'emails.0.value': 'email',
    'username': 'login'
  }
},
function(accessToken, refreshToken, profile, cb)
{
  UserModel.findOrCreate
  (
    { fortytwoId: profile.id },
    {
      active: true,
      avatar: profile.photos[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      username: profile.username,
      password: 'token?',
      fortytwoId: profile.id
    },
    function (err, user_object) { return cb(err, user_object); }
  );
}));

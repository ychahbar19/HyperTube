/* ------------------------------------------------------------------------ *\
    Defines variables and functions for passport session.
\* ------------------------------------------------------------------------ */

const passport = require('passport');
const Strategy42 = require('passport-42').Strategy;
//const FacebookStrategy = require('passport-facebook').Strategy;
const GithubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('../models/UserModel');

// Function to allow serialization of the UserModel object
// (from the app, as it is sent by the strategy's callback function)
// into a user value (for the client cookie).      
passport.serializeUser(function(user_object, done)
{
  done(null, user_object.id);
});

// Function to allow deserialization of the user id
// (from the client, as the cookie sent by the client's browser)
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

// ------ Common function for action on success ------

function authSuccess(authProvider, profile, done)
{
  if (profile.username)
    userName = profile.username;
  else
    userName = profile.displayName;
  userName = (userName + Math.round(+new Date()/1000)).replace(' ', '')
  if (!profile.name)
  {
    profile['name'] = {
      'givenName': profile.displayName.split(' ').slice(0, -1).join(' '),
      'familyName': profile.displayName.split(' ').slice(-1).join(' ')
    }
  }
  if (profile.name.givenName == '')
    profile.name.givenName = userName;
  if (profile.name.familyName == '')
    profile.name.familyName = userName;
  if (authProvider == 'google')
    avatar = 'http://localhost:3000/assets/pictures/__default-profile-pic.png';
  else
    avatar = profile.photos[0].value
  UserModel.findOrCreate(
    { email: profile.emails[0].value },
    {
      active: true,
      provider: authProvider,
      providerId: profile.id,
      avatar: avatar,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      username: userName, //With timestamp for uniqueness
      password: 'none' /* --------- does this allow sign in using HT and 'none' password ?? */
    },
    function (error, found_user)
    {
      if (error)
        return done(error);
      if (!found_user)
        return done(null, false, { message: 'NoUser' });
      return done(null, found_user);
    });
}

// ------ 42 authentification ------
//ID and secret defined at https://profile.intra.42.fr/oauth/applications/4260

passport.use(new Strategy42(
{  
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
function(accessToken, refreshToken, profile, done)
{
  return authSuccess('42', profile, done);
}));

// ------ Facebook authentification ------
// ID and secret defined at https://developers.facebook.com/apps/1095920914095181/fb-login/settings/

// ------ Github authentification ------
// ID and secret defined at https://github.com/settings/applications/1317082

passport.use(new GithubStrategy(
{
  clientID: '2ed31b7996f640b25060',
  clientSecret: '419a9f9e98d35758e7a4e813f312fb05fe132a7c',
  callbackURL: "http://localhost:3000/api/auth/github/callback",
  scope: 'user:email'
},
function(accessToken, refreshToken, profile, done)
{
  return authSuccess('GitHub', profile, done);
}
));

// ------ Google authentification ------
//npm install passport-google-oauth20 --save
// ID and secret defined at https://console.developers.google.com/apis/credentials/oauthclient/906011525965-13t11do75gift1g4hk36stv73p5n1555.apps.googleusercontent.com?project=hypertube-272819

passport.use(new GoogleStrategy(
{
  clientID: '906011525965-13t11do75gift1g4hk36stv73p5n1555.apps.googleusercontent.com',
  clientSecret: 'WvUjkDkt-AqEAMrjZem6Cl1f',
  callbackURL: "http://localhost:3000/api/auth/google/callback"
  //profileFields:
},
function(accessToken, refreshToken, profile, done)
{
  return authSuccess('google', profile, done);
}
));
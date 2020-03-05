// EXPRESS APPLICATION

/* -------------------------------------------------------------------------- *\
    1) Imports the required elements (node packages, routes).
\* -------------------------------------------------------------------------- */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const keys = require('./config/keys');

const homeRoutes = require('./routes/home');
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

/* -------------------------------------------------------------------------- *\
    2) Connects to MongoDB (https://cloud.mongodb.com/).
\* -------------------------------------------------------------------------- */

mongoose.connect('mongodb+srv://cbrichau:hypertube19@cluster0-fzc0r.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* -------------------------------------------------------------------------- *\
    3) Creates the express application.
    - Everytime the server is requested (from server.js), it calls 'app'.
    The first app.<method> (= middleware) launches the process and moves it on
    to the following middleware with 'next/next()'.
    - The method .use/.post/.get,. applies to all/post/get requests.
    - Each method applies to the given route, or all if none given.
    - The response 'res' is sent when it's content is defined.
\* -------------------------------------------------------------------------- */

const app = express();

//- Allows access to our API from any origin (*).
//- Assigns the given headers to requests to our API (Origin, X-Requested...).
//- Allows requests with different methods (GET,POST...).
app.use((req, res, next) =>
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Processes ALL requests to tranforms it's body into a Json object (usable in JS).
app.use(bodyParser.json());

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.google.clientID,
      // clientID: GOOGLE_CLIENT_ID,
      clientSecret: keys.google.clientSecret,
      // clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4200/home'
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function(err, user) {
        return done(err, user);
      });
    }
  )
);

// set this folder as static folder we want to serve
app.use(express.static(__dirname + '/assets'));

//Send requests for the route '/api/xxx' to the router xxxRoutes.
app.use('/', homeRoutes);
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

//Exports the app to make it accessible from the other files (incl. server.js).
module.exports = app;

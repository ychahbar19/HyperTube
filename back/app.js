// EXPRESS APPLICATION

/* -------------------------------------------------------------------------- *\
    1) Imports required node packages & config elements.
\* -------------------------------------------------------------------------- */

const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');

// const homeRoutes = require('./routes/home');
// const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');
const signinRoutes = require('./routes/signin');
const signUpRoutes = require('./routes/signup');
const profileRoutes = require('./routes/profile');
const editProfileRoutes = require('./routes/editProfile');
require('./config/database');
require('./config/authentification');

/* -------------------------------------------------------------------------- *\
    2) Creates the express application.
\* -------------------------------------------------------------------------- */

const app = express();

/* -------------------------------------------------------------------------- *\
    3) Imports and calls the required routes.
    - Everytime the server is requested (from server.js), it calls 'app'.
      Then the different app.<method> (= middlewares) are called in turn
      with 'next/next()', until a response 'res' is defined.
    - The <method> .use/.post/.get applies to all/post/get requests.
    - Each <method> applies to the given route, or all if none given.
\* -------------------------------------------------------------------------- */

/* ------------------------ Common routes ------------------------ */

app.use(expressSession(
{
    secret: 'ssshhhhh',
    name: 'expressSession',
    resave: false,
    saveUninitialized: true,
    cookie:
    {
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + (3 * 60 * 60 * 1000))
    }
}));
app.use((req, res, next) => // Allows access to our API from any origin, with any method and any header.
{
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*, Authorization');
  next();
});
app.use(bodyParser.json()); //Processes ALL requests to tranforms it's body into a Json object (usable in JS).
app.use(bodyParser.urlencoded({ extended: true })); //??
app.use(passport.initialize()); //Initialises the authentication module.
app.use(passport.session()); //Alters 'req' to transform the user value (from the client cookie), which is the session id, into a UserModel object.

/* ------------------------ ???? ------------------------ */

// set this folder as static folder we want to serve
app.use('/assets', express.static(path.join(__dirname, 'assets')));

/* ------------------------ API routes ------------------------ */

// const userRoutes = require('./routes/user');
// const signUpRoutes = require('./routes/signup');
// const signinRoutes = require('./routes/signin');
// const UserRoute = require('./routes/UserRoute');
// const authentificationRoute = require('./routes/AuthentificationRoute');
// const profileRoutes = require('./routes/profile');
// const editProfileRoutes = require('./routes/editProfile');
const searchRoute = require('./routes/SearchRoute');
const videoRoute = require('./routes/VideoRoute');
const commentsRoute = require('./routes/commentsRoute');
const homeRoute = require('./routes/HomeRoute');

app.use('/api/auth', userRoutes);
app.use('/signup', signUpRoutes);
app.use('/signin', signinRoutes);
// app.use('/api/user', UserRoute);
// app.use('/api/authentification', authentificationRoute);
app.use('/profile', profileRoutes);
app.use('/editProfile', editProfileRoutes);
app.use('/api/search', searchRoute);
app.use('/api/video', videoRoute);
app.use('/api/comments', commentsRoute);
app.use('/', homeRoute);

/* ----- Fallback function ----- */
app.use((req, res) =>
{
   res.send('Bad request to 3000');
});

/* -------------------------------------------------------------------------- *\
    5) Exports the app to make it accessible from the other files
    (incl. server.js).
\* -------------------------------------------------------------------------- */

module.exports = app;

// EXPRESS APPLICATION

/* -------------------------------------------------------------------------- *\
    1) Imports required node packages & config elements.
\* -------------------------------------------------------------------------- */

const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
// const cors = require('cors');

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

/*
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
*/
// app.use(cors());

app.use((req, res, next) => // Allows access to our API from any origin, with any method and any header.
{  if (req.params.lang)
    console.log('ici');
    
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Credentials', true); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*, Authorization');
  next();
});
app.use(bodyParser.json()); //Processes ALL requests to tranforms it's body into a Json object (usable in JS).
//app.use(bodyParser.urlencoded({ extended: true })); //??
app.use(passport.initialize()); //Initialises the authentication module.
app.use(passport.session()); //Alters 'req' to transform the user value (from the client cookie), which is the session id, into a UserModel object.

/* ------------------------ ???? ------------------------ */

// set this folder as static folder we want to serve
app.use('/assets', express.static(path.join(__dirname, 'assets')));

/* ------------------------ API routes ------------------------ */

const authRoute = require('./routes/AuthRoute');
const userRoute = require('./routes/UserRoute');
const searchRoute = require('./routes/SearchRoute');
const videoRoute = require('./routes/VideoRoute');
const commentsRoute = require('./routes/commentsRoute');
const homeRoute = require('./routes/HomeRoute');

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
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

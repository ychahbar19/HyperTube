// EXPRESS APPLICATION

/* -------------------------------------------------------------------------- *\
    1) Imports required node packages & config elements.
\* -------------------------------------------------------------------------- */

const express = require('express');
const expressSession = require('express-session');//npm install express-session --save
const bodyParser = require('body-parser');
const passport = require('passport');

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
      with 'next/next()', until a response is defined.
    - The <method> .use/.post/.get applies to all/post/get requests.
    - Each <method> applies to the given route, or all if none given.
    - The response 'res' is sent when its content is defined.
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
app.use((req, res, next) =>
{
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allows access to our API from any origin.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Allows requests with different methods.
  //res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Assigns the given headers to requests to our API.
  res.setHeader('Access-Control-Allow-Headers', '*, Authorization'); // Assigns the given headers to requests to our API.
  next();
});
app.use(bodyParser.json()); //Processes ALL requests to tranforms it's body into a Json object (usable in JS).
app.use(bodyParser.urlencoded({ extended: true })); //??
app.use(passport.initialize()); //Initialises the authentication module.
app.use(passport.session()); //Alters 'req' to transform the user value (from the client cookie), which is the session id, into a UserModel object.

/* ------------------------ API routes ------------------------ */

const UserRoute = require('./routes/UserRoute');
const authentificationRoute = require('./routes/AuthentificationRoute');
const searchRoute = require('./routes/SearchRoute');
const videoRoute = require('./routes/VideoRoute');
const commentsRoute = require('./routes/commentsRoute');
const homeRoute = require('./routes/HomeRoute');

app.use('/api/user', UserRoute);
app.use('/api/authentification', authentificationRoute);
app.use('/api/search', searchRoute);
app.use('/api/video', videoRoute);
app.use('/api/comments', commentsRoute);
app.use('/', homeRoute);

/* -------------------------------------------------------------------------- *\
    5) Exports the app to make it accessible from the other files
    (incl. server.js).
\* -------------------------------------------------------------------------- */

module.exports = app;

// EXPRESS APPLICATION

/* -------------------------------------------------------------------------- *\
    1) Imports the required node packages.
\* -------------------------------------------------------------------------- */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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
    Everytime the server is requested (from server.js), it calls 'app'.
    Then the different app.<method> (= middlewares) are called in turn
    with 'next/next()', until a response is defined.
\* -------------------------------------------------------------------------- */

const app = express();

app.use((req, res, next) =>
{
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allows access to our API from any origin.
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Assigns the given headers to requests to our API.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Allows requests with different methods.
  next();
});

app.use(bodyParser.json()); //Processes ALL requests to tranforms it's body into a Json object (usable in JS).
app.use(bodyParser.urlencoded({ extended: true }));

/* -------------------------------------------------------------------------- *\
    4) Imports and calls the required routes.
    - The method .use/.post/.get,. applies to all/post/get requests.
    - Each method applies to the given route, or all if none given.
    - The response 'res' is sent when it's content is defined.
\* -------------------------------------------------------------------------- */

const passport = require('passport');
const userRoutes = require('./routes/user');
const authentificationRoute = require('./routes/AuthentificationRoute');
const searchRoute = require('./routes/SearchRoute');
const videoRoute = require('./routes/VideoRoute');
const commentsRoute = require('./routes/commentsRoute');
const homeRoute = require('./routes/HomeRoute');

app.use(passport.initialize());
app.use(passport.session());
app.use('/api/auth', userRoutes);
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

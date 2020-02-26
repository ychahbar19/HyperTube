// EXPRESS APPLICATION

/* -------------------------------------------------------------------------- *\
    1) Imports the required elements (node packages, routes).
\* -------------------------------------------------------------------------- */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');
const signinRoutes = require('./routes/signin');

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

//check
app.use('/', (req, res) =>
{
  /*
  const layout_elements =
  [
    { meta_title: 'Home', h1_title: 'Welcome to HyperTube' }
  ];*/
  const layout_elements =
  {
    'en': { field_1: 'field_1', field_2: 'field_2', field_3: 'field_3' },
    'fr': { field_1: 'field_1', field_2: 'field_2', field_3: 'field_3' }
  };
  res.status(200).json(
  {
    message: 'Successful request to /',
    layout_elements: layout_elements.en
  });
});

//Send requests for the route '/api/xxx' to the router xxxRoutes.
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/signin', signinRoutes);

//Exports the app to make it accessible from the other files (incl. server.js).
module.exports = app;

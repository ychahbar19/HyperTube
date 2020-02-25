// EXPRESS APPLICATION

/* -------------------------------------------------------------------------- *\
    1) Imports the required node packages.
\* -------------------------------------------------------------------------- */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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

/* -------------------------------------------------------------------------- *\
    4) Imports and calls the required routes.
    - The method .use/.post/.get,. applies to all/post/get requests.
    - Each method applies to the given route, or all if none given.
    - The response 'res' is sent when it's content is defined.
\* -------------------------------------------------------------------------- */

const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');
const videoRoutes = require('./routes/VideoRoute');

//check
/*
app.use('/', (req, res) =>
{
  const layout_elements =
  {
    'en': { field_1: 'field_1', field_2: 'field_2', field_3: 'field_3' },
    'fr': { field_1: 'field_1', field_2: 'field_2', field_3: 'field_3' }
  };
  res.status(200).json(
  {
    message: 'Successful request to /',
    layout_elements: layout_elements['en']
  });
});
*/

app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

app.use('/api/video', videoRoutes);

/* -------------------------------------------------------------------------- *\
    5) Exports the app to make it accessible from the other files
    (incl. server.js).
\* -------------------------------------------------------------------------- */

module.exports = app;

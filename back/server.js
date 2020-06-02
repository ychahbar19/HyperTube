// NODE SERVER
/*
Source: https://openclassrooms.com/en/courses/6390246-passez-au-full-stack-avec-node-js-express-et-mongodb/6466231-demarrez-votre-serveur-node
Note: Need aliases for commands installed locally:
  alias ng="/Users/...project_path.../node_modules/@angular/cli/bin/ng"
  alias nodemon=/Users/...project_path.../node_modules/nodemon/bin/nodemon.js
*/

/* -------------------------------------------------------------------------- *\
    1) Imports the required elements (node package, express app from app.js).
\* -------------------------------------------------------------------------- */

const http = require('http'); // Node package that has the .createServer() fct.
const app = require('./app');

const cronTask = require('./cronTask');

/* -------------------------------------------------------------------------- *\
    2) Defines the port on which 'app' runs.
\* -------------------------------------------------------------------------- */

// NormalizePort() returns a valid default value (given as number or string).
const normalizePort = val =>
{
  const port = parseInt(val, 10);
  if (isNaN(port))
    return val;
  if (port >= 0)
    return port;
  return false;
};

// Port = default valid value or, if none defined, 3000.
const port = normalizePort(process.env.PORT || '3000');

//Set the chosen port to the app's configuration.
app.set('port', port);

/* -------------------------------------------------------------------------- *\
    3) Creates the server using 'app' (which manages the req->res process).
\* -------------------------------------------------------------------------- */

const server = http.createServer(app);

/* -------------------------------------------------------------------------- *\
    4) Defines the functions for handling errors and listening to requests.
\* -------------------------------------------------------------------------- */

const onError = error =>
{
  if (error.syscall !== 'listen')
    throw error;
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code)
  {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () =>
{
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
  cronTask.startJob();
  // console.log('Cron task started !');
};

/* -------------------------------------------------------------------------- *\
    5) Launches the server.
\* -------------------------------------------------------------------------- */

server.on('error', onError);
server.on('listening', onListening);
server.listen(port);
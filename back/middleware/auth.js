// MIDDLEWARE to protect routes requiring an authentified user.

/* -------------------------------------------------------------------------- *\
    1) Imports the required elements (node package)
\* -------------------------------------------------------------------------- */

const jwt = require('jsonwebtoken');

/* -------------------------------------------------------------------------- *\
    2)
\* -------------------------------------------------------------------------- */

module.exports = (req, res, next) => {
  try {
    //Gets the token from the Authorization header,
    //(i.e. the element after the space: "Authorization: Bearer eyJhbGciO..."),
    //and decodes it (i.e. turns it back it a JS element, usable as such).
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'secret_this_should_be_longer');
    // const decodedToken = jwt.verify(token, 'secret_this_should_be_longer');

    //Checks the userId from the token matches the one from the request.
    //If so, calls next() to get the process going.
    // const userId = decodedToken.userId;
    // if (req.body.userId && req.body.userId !== userId)
    //   throw 'Invalid user id';
    // else
      next();
  } catch (error) {
    res.status(401).json({ error: error | 'Requête non authentifee '});
  }
};



// to use: const authCheck = require(this file !!);

// router.post('/', authCheck, xxxxx, yyyyy, (req, res, next) ...);

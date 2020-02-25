// EXPRESS ROUTER for User

/* -------------------------------------------------------------------------- *\
    1) Imports the required elements (node package + controller)
\* -------------------------------------------------------------------------- */

const express = require('express');
const userCtrl = require('../controllers/user');

/* -------------------------------------------------------------------------- *\
    2) Creates the Router object.
\* -------------------------------------------------------------------------- */

const router = express.Router();

/* -------------------------------------------------------------------------- *\
    3) Calls the controller's functions based on the request's type & route.
\* -------------------------------------------------------------------------- */

//check
router.get('/', (req, res) => {
   res.json({ message: 'Req to /api/auth' });
});

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

/* -------------------------------------------------------------------------- *\
    4) Exports the router.
\* -------------------------------------------------------------------------- */

module.exports = router;

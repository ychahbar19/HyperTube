// EXPRESS ROUTER for Thing

/* -------------------------------------------------------------------------- *\
    1) Imports the required elements.
\* -------------------------------------------------------------------------- */

const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const stuffCtrl = require('../controllers/stuff');

/* -------------------------------------------------------------------------- *\
    2) Creates the Router object.
\* -------------------------------------------------------------------------- */

const router = express.Router();

/* -------------------------------------------------------------------------- *\
    3) Calls the controller's functions based on the request's type & route
    (after calling auth to ensure the user has access to these fcts).
\* -------------------------------------------------------------------------- */

//Directs GET requests with the route '(/api/stuff)/'.
router.get('/', auth, stuffCtrl.getAllThings);

//Directs POST requests with the route '(/api/stuff)/'.
router.post('/', auth, multer, stuffCtrl.createThing);

//Directs GET requests with the route '(/api/stuff)/' and the parameter 'id'.
router.get('/:id', auth, stuffCtrl.getOneThing);
router.put('/:id', auth, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);

/* -------------------------------------------------------------------------- *\
    4) Exports the router.
\* -------------------------------------------------------------------------- */

module.exports = router;

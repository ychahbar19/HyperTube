/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const express = require('express');
const SearchController = require('../controllers/SearchController');

const router = express.Router();

/* ------------------------------------------------------------------------ *\
    2) Calls to the controller's functions based on the request type/route.
\* ------------------------------------------------------------------------ */

/* ----- Search function ----- */
router.get('', SearchController.search);

/* ----- Fallback function ----- */
router.use((req, res) => {
   res.send('Bad request to /api/search');
});

/* ------------------------------------------------------------------------ *\
    3) Exports the router.
\* ------------------------------------------------------------------------ */

module.exports = router;

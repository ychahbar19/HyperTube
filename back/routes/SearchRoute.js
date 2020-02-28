// EXPRESS ROUTER for Search

/* ------------------------------------------------------------------------ *\
    1) Imports the required elements and creates express' Router object.
\* ------------------------------------------------------------------------ */

const express = require('express');
const SearchController = require('../controllers/SearchController');
const router = express.Router();

/* ------------------------------------------------------------------------ *\
    2) Calls the controller's functions based on the request type/route.
\* ------------------------------------------------------------------------ */

router.get('/movies', SearchController.searchMovies);
router.get('/tvshows', SearchController.searchTVShows);
router.get('/', SearchController.searchAll);

/* ----- Fallback function ----- */
router.use((req, res) => {
   res.send('Bad request to /api/search');
});

/* ------------------------------------------------------------------------ *\
    3) Exports the router.
\* ------------------------------------------------------------------------ */

module.exports = router;

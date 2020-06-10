/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const express = require('express');
const VideoController = require('../controllers/VideoController');

const router = express.Router();

/* ------------------------------------------------------------------------ *\
    2) Calls to the controller's functions based on the request type/route.
\* ------------------------------------------------------------------------ */

/* ----- Layout ----- */

/* ----- Get info function ----- */
router.get('/:imdb_id/:yts_id?', VideoController.getVideoInfo);

/* ----- register the movie as seen in the DB ----- */
router.get('/seenVideo', VideoController.setSeenMovie);

/* ----- Download movie and stream ----- */
router.get('/stream/:hash/:imdbId', VideoController.streamManager);

/* ----- Fallback function ----- */
router.use((req, res) =>
{
  res.send('Bad request to /api/video');
});

/* ------------------------------------------------------------------------ *\
    3) Exports the router.
\* ------------------------------------------------------------------------ */

module.exports = router;

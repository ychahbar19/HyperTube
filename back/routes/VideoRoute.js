/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const express = require('express');
const VideoController = require('../controllers/VideoController');

const router = express.Router();

const authCheck = require('../middleware/auth');

/* ------------------------------------------------------------------------ *\
    2) Calls to the controller's functions based on the request type/route.
\* ------------------------------------------------------------------------ */

/* ----- Layout ----- */


/* ----- check if movie is Seen ----- */
router.get('/isSeen/:movie', authCheck, VideoController.isSeen);

/* ----- register the movie as seen in the DB ----- */
router.get('/seenMovie/:imdbId', authCheck, VideoController.setSeenMovie);

/* ----- Get info function ----- */
router.get('/:imdb_id/:yts_id?', authCheck, VideoController.getVideoInfo);

/* ----- Download movie and stream ----- */
router.get('/stream/:hash/:imdbId', VideoController.streamManager);

/* ----- Read Subtitles as a Stream ----- */
router.get('/subtitles/:lang/:hash', VideoController.streamSubtitles);

/* ----- Fallback function ----- */
router.use((req, res) =>
{
  res.send('Bad request to /api/video');
});

/* ------------------------------------------------------------------------ *\
    3) Exports the router.
\* ------------------------------------------------------------------------ */

module.exports = router;

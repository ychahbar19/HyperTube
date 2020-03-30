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

router.get('/stream/:torrentHash', function(req, res, next) {
    console.log(req.params);
    res.status(200).json({ message: 'called torrent-stream' })
    // console.log(req);
});

/* ----- Fallback function ----- */
router.use((req, res) =>
{
  res.send('Bad request to /api/video');
});

/* ------------------------------------------------------------------------ *\
    3) Exports the router.
\* ------------------------------------------------------------------------ */

module.exports = router;

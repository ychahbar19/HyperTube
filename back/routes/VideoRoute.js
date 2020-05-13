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

// Check aussi si le fichier est deja dans le dossier tmp.
// Si non, normal -> on commence le telechargement -> 2% return resp
// Si oui, return resp directement avec status downloading et on lance le telechargement.
// Si qqun seek, on veut attendre 2% -> cas OUI (juste au-dessus) doit check si on seek ou pas !
// ++++ Send to client when video is fully downloaded !!
router.post('/stream', VideoController.checkDownloadedVids, VideoController.downloadTorrent);

/* ----- Fallback function ----- */
router.use((req, res) =>
{
  res.send('Bad request to /api/video');
});

/* ------------------------------------------------------------------------ *\
    3) Exports the router.
\* ------------------------------------------------------------------------ */

module.exports = router;

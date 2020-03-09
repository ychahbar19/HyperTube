/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const express = require('express');
const CommentsController = require('../controllers/CommentsController');

const router = express.Router();

/* ------------------------------------------------------------------------ *\
    2) Calls to the controller's functions based on the request type/route.
\* ------------------------------------------------------------------------ */

/* ----- CRUD functions ----- */
router.get('/create', CommentsController.create);
router.get('/read/:video_imdb_id', CommentsController.read);
router.put('/update/:comment_id', CommentsController.update);
router.delete('/delete/:comment_id', CommentsController.delete);

/* ----- Fallback function ----- */
router.use((req, res) => {
   res.send('Bad request to /api/comments');
});

/* ------------------------------------------------------------------------ *\
    3) Exports the router.
\* ------------------------------------------------------------------------ */

module.exports = router;

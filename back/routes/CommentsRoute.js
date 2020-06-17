/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const express = require('express');
const authCheck = require('../middleware/auth');
const CommentsController = require('../controllers/CommentsController');

const router = express.Router();

/* ------------------------------------------------------------------------ *\
    2) Calls to the controller's functions based on the request type/route.
\* ------------------------------------------------------------------------ */

/* ----- CRUD functions ----- */
router.post('/create', authCheck, CommentsController.create);
router.get('/read/:video_imdb_id/:language', authCheck, CommentsController.read);
// router.put('/update/:comment_id', CommentsController.update);
// router.delete('/delete/:comment_id', CommentsController.delete);

/* ----- Fallback function ----- */
router.use((req, res) => {
   res.send('Bad request to /api/comments');
});

/* ------------------------------------------------------------------------ *\
    3) Exports the router.
\* ------------------------------------------------------------------------ */

module.exports = router;

// EXPRESS ROUTER for Comments

/* ------------------------------------------------------------------------ *\
    1) Imports the required elements and creates express' Router object.
\* ------------------------------------------------------------------------ */

const express = require('express');
const CommentsController = require('../controllers/CommentsController');
const router = express.Router();

/* ------------------------------------------------------------------------ *\
    2) Calls the controller's functions based on the request type/route.
\* ------------------------------------------------------------------------ */

/* ----- CRUD functions ----- */
router.post('/create', CommentsController.create);
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

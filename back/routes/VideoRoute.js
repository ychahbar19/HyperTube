// EXPRESS ROUTER for Video

/* ------------------------------------------------------------------------ *\
    1) Imports the required elements and creates express' Router object.
\* ------------------------------------------------------------------------ */

const express = require('express');
//const auth = require('../middleware/auth');
//const multer = require('../middleware/multer-config');
const VideoController = require('../controllers/VideoController');
const router = express.Router();

/* ------------------------------------------------------------------------ *\
    2) Calls the controller's functions based on the request type/route.
\* ------------------------------------------------------------------------ */

/* ----- Layout ----- */


/* ----- CRUD functions ----- */
// router.post('/create', VideoController.create);
// router.get('/read', VideoController.readAll);
// router.get('/read/:id', VideoController.readOne);
// router.put('/update/:id', VideoController.update);
// router.delete('/delete/:id', VideoController.delete);

router.get('/:id', VideoController.getVideoInfo);

/* ----- Fallback function ----- */
router.use((req, res) => {
   res.send('Bad request to /api/video');
});

/* ------------------------------------------------------------------------ *\
    3) Exports the router.
\* ------------------------------------------------------------------------ */

module.exports = router;

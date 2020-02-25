// EXPRESS ROUTER for User

/* ------------------------------------------------------------------------ *\
    1) Imports node's express package, the controller,
       and creates express' Router object.
\* ------------------------------------------------------------------------ */

const express = require('express');
const videoCtrl = require('../controllers/VideoController');
const router = express.Router();

/* ------------------------------------------------------------------------ *\
    2) Calls the controller's functions based on the request type/route.
\* ------------------------------------------------------------------------ */

/* ----- CRUD functions ----- */
router.get('/create', videoCtrl.create); //should be post
router.get('/read', videoCtrl.create);
router.post('/update', videoCtrl.create);
router.get('/delete', videoCtrl.create);

/* ----- Fallback function ----- */
router.use((req, res) => {
   res.send('Bad request to /api/video');
});

/* ------------------------------------------------------------------------ *\
    3) Exports the router.
\* ------------------------------------------------------------------------ */

module.exports = router;

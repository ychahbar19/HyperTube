const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.post('/', UserController.userExists, UserController.getUserData);

/* ----- Fallback function ----- */
router.use((req, res) => {
    res.send('Bad request to /signin');
});

// router.get('/google', () => {
  
// });

module.exports = router;
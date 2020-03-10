const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.post('/', UserController.loginInputsValidation, UserController.login);

/* ----- Fallback function ----- */
router.use((req, res) => {
    res.send('Bad request to /signin');
});

module.exports = router;
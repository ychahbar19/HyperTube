const express = require('express');
const UserController = require('../controllers/UserController');
// const utils = '../utils/utils.js';

const router = express.Router();


// router.post('/', UserController.utils);
router.post('/', UserController.signupValidation, UserController.createUser);

/* ----- Fallback function ----- */
router.use((req, res) => {
  res.send('Bad request to /signup');
});

module.exports = router;
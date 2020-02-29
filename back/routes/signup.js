const express = require('express');
const UserController = require('../controllers/UserController');
// const utils = '../utils/utils.js';

const router = express.Router();


// router.post('/', UserController.utils);
router.post('/', UserController.signupValidation, UserController.createUser);

module.exports = router;
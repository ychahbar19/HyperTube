const express = require('express');
const UserController = require('../controllers/UserController');
const utils = '../utils/utils.js';

const router = express.Router();


router.post('/', UserController.utils);

module.exports = router;
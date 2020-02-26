const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.post('/', async (req, res, next) => {
    console.log('yessssss');
});

module.exports = router;
const express = require('express');
const UserController = require('../controllers/UserController');
const authCheck = require('../middleware/auth');

const router = express.Router();

router.post('/', authCheck, UserController.updateUser());
// , authCheck, UserController.getInfoById

router.use((req, res) => {
    res.send('bad request to /edit-profile');
});

module.exports = router;
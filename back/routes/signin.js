const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.post('/', async (req, res, next) => {
    let userExists;
    const userController = new UserController();

    userExists = await userController.userExists(req.body);
    if (userExists) {
        res.userController = userController;
        next();
    } else {
        res.status(200).send(null);
    }
});

router.post('/', async (req, res, next) => {
    const userController = res.userController;
    const userData = await userController.getUserData(req.body);
    res.status(200).json(userData);
});

module.exports = router;

const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');


exports.validLoginInputs = (req, res, next) => {
  console.log("VALID");
  return next();
};

exports.userExists = (req, res, next) => {
  const user = new UserModel({
    username: req.body.username,
    password: req.body.password 
  });
  // check if user exists in db
  const userExists = false;
  if (userExists)
    return next();
  return res.status(200).send(null);
};

exports.getUserData = (req, res, next) => {
  const user = new UserModel({
    username: req.body.username,
    password: req.body.password
  });
  // get informations from db about user
  const userData = {
    id: 1,
    firstName: 'Adam',
    lastName: 'Ceciora',
    username: req.body.username,
    photoUrl: 'https://cdn.intra.42.fr/users/small_aceciora.jpg',
    loggedIn: true
  }
  return res.status(200).json(userData);
};


// signin() {
//   appel bdd pour set user a loggedIn
// }


// module.exports = UserController;
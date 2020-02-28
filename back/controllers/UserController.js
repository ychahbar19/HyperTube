const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');

let inputErrors = [];

function validLength(strlen, min_len, max_len = 33) {
  if (strlen >= min_len && strlen <= max_len)
  return (true);
  return false;
}

function validPattern(str, pattern) {
  if (pattern.test(str)) {
    return true;
  }
  return false;
}

exports.validLoginInputs = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username == null) {
    inputErrors.push('USR_REQ');
  }
  if (!validLength(username.length, 6)) {
    inputErrors.push('USR_LEN');
  }
  if (!validPattern(username, /[a-zA-Z0-9]+$/)) {
    inputErrors.push('USR_PATTERN');
  }
  if (password == null) {
    inputErrors.push('PWD_REQ');
  }
  if (!validLength(password.length, 8)) {
    inputErrors.push('PWD_LEN');
  }
  if (!validPattern(password, /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/)) {
    inputErrors.push('PWD_PATTERN');
  }

  if (inputErrors.length) {
    return res.status(403).json(inputErrors);
  }
  return next();
};

exports.userExists = (req, res, next) => {
  const user = new UserModel({
    username: req.body.username,
    password: req.body.password 
  });
  // check if user exists in db
  const userExists = true;
  if (userExists)
    return next();
  inputErrors.push('USR_NOT_EXISTS');
  return res.status(403).json(inputErrors);
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
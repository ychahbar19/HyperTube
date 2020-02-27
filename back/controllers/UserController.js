const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');


let inputErrors = { username: {}, password: {}, unmatch: '' };


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
  const errors = {
    username: {
      req: 'Username is required',
      len: 'Username should have between 6 and 33 characters',
      pattern: 'Username should be only alphacharacters'
    },
    password: {
      req: 'Password is required',
      len: 'Password should have between 8 and 33 characters',
      pattern: 'Password must be at least 1 digit, 1 lowercase, 1 uppercase and 1 of special chars [@$!%*?&]'
    },
  };
  let err = false;

  if (!username == null) {
    err = true;
    inputErrors.username.req = errors.username.req;
  }
  if (validLength(username.length, 6)) {
    err = true;
    inputErrors.username.len = errors.username.len;
  }
  if (!validPattern(username, /[a-zA-Z0-9]+$/)) {
    err = true;
    inputErrors.username.pattern = errors.username.pattern;
  }
  if (!password == null) {
    err = true;
    inputErrors.password.req = errors.password.req;
  }
  if (!validLength(password.length, 8)) {
    err = true;
    inputErrors.password.len = errors.password.len;
  }
  if (!validPattern(password, /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/)) {
    err = true;
    inputErrors.password.pattern = errors.password.pattern;
  }

  if (err) {
    console.log('calsibeed');
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
  const userExists = false;
  if (userExists)
    return next();
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
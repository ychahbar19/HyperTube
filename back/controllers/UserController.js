const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;

const UserModel = require('../models/UserModel');

const usernamePattern = new RegExp('^[a-zA-Z0-9]{6,33}$');
const passwordPattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,33}$');
const emailPattern = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$');

function validPattern(str, pattern) {
  if (pattern.test(str))
    return true;
  return false;
}

function getById(id) {

}

// sign in

exports.loginInputsValidation = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  let error = false;

  if (username == null || !validPattern(username, usernamePattern) ||
      password == null || !validPattern(password, passwordPattern))
        error = true;

  if (error)
    return res.status(403).json({ message: 'An error occured !' });
  return next();
};

exports.login = async (req, res, next) => {
  // check if user exists in db
  try {
    const foundUser = await UserModel.findOne({ username: req.body.username });
    if (!foundUser) {
      return res.status(401).json({ message: 'The username doesn\'t belong to any account. Please create an account' });
    }
    const samePwds = await bcrypt.compare(req.body.password, foundUser.password);
    if (!samePwds) {
      return res.status(401).json({ message: 'The password is incorrect. Please try again !' });
    }
    const token = jwt.sign(
      {
        userId: foundUser._id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        username: foundUser.username
      },
      'secret_this_should_be_longer',
      { expiresIn: '10h' }
    );
    res.status(200).json({ token: token, expiresIn: 36000 });
  } catch (err) {
    res.status(500).send(err);
  }
};

// sign up

exports.signupInputsValidation = (req, res, next) => {
  let error = false;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const email = req.body.email;

  // checker les inputs firstName, lastName, ..
  if (username == null || !validPattern(username, usernamePattern) ||
      password == null || !validPattern(password, passwordPattern) ||
      !validPattern(email, emailPattern)) {
        return res.status(403).json({ message: 'An error occured !' });
      }

  if (password !== confirmPassword)
    return res.status(403).json({ message: 'Passwords do not match' });

  return next();
};

exports.createUser = async (req, res, next) => {
  try {
    const hashPwd = await bcrypt.hash(req.body.password, 10);
    const url = req.protocol + "://" + req.get("host");

    const user = new UserModel({
      avatar: url + "/assets/pictures/" + req.file.filename,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: hashPwd
    });
    res.savedUser = await user.save();
    return next();
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.activateAccount = async (req, res, next) => {
  try {
    // const foundUser = await UserModel.findOne({ _id: ObjectId(req.body.id) });
    // if (!foundUser) {
    //   return res.status(401).json({ message: 'Oops ! Something went wrong !' });
    // }
    const updatedUser = await UserModel.update(
      { '_id': ObjectId(req.body.id) },
      { $set : {'active' : true} }
    );
    if (!updatedUser) {
      return res.status(401).json({ message: 'Oops ! Something went wrong !' });
    }
    return res.status(200).json({ message: 'Account activated' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

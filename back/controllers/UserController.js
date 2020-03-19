const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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

// async function findByUsername(username) {
//   return foundUser = await UserModel.findOne({ username: username });
// }

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
    return res.status(200).json({ token: token, expiresIn: 36000 });
  } catch (err) {
    return res.status(500).send(err);
  }
};

// sign up

exports.signupInputsValidation = (req, res, next) => {
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
    return res.status(500).json({ message: err.message });
  }
};

// Activate account after clicking on confirmation email

exports.activateAccount = async (req, res, next) => {
  try {
    const oUserId = ObjectId(req.body.id);
    const foundUser = await UserModel.findOne({
      _id: oUserId,
      active: false
    });
    if (!foundUser) {
      return res.status(401).json({ message: 'Oops ! Something went wrong !' });
    }
    await UserModel.update(
      { '_id': oUserId },
      { $set: { 'active': true } }
    );
    return res.status(200).json({ message: 'Account activated' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// Random string to reset password

exports.createRandomStr = async (req, res, next) => {
  try {
    req.user = await UserModel.findOne({
      username: req.body.username
    });
    if (!req.user)
      return res.status(401).json({ message: 'User not found in database !'});
      // check status code
    crypto.randomBytes(20, async (err, buffer) => {
      if (err)
        return res.status(400).json({ message: 'Couldn\'t create a reset hash !'});
      res.locals.randomStr = buffer.toString('hex');
      await UserModel.update(
        { username: req.user.username },
        { $set: { randomStr: res.locals.randomStr } }
      );
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

exports.checkIdAndHash = async (req, res, next) => {
  try {
    const foundUser = await UserModel.findOne({
      _id: req.body.id,
      randomStr: req.body.hash
    });
    if (!foundUser)
      return res.status(401).json({ message: 'Oops! Something went wrong' });
      // check status code
    next();
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

exports.checkPassword = (req, res, next) => {
  const password = req.body.formData.password;
  const confirmPassword = req.body.formData.confirmPassword;

  if (password == null || !validPattern(password, passwordPattern))
    return res.status(403).json({ message: "An error occured !" });
  if (password !== confirmPassword)
    return res.status(403).json({ message: "Passwords do not match" });

  next();
};

exports.resetPwd = async (req, res, next) => {
  try {
    const hashPwd = await bcrypt.hash(req.body.formData.password, 10);
    await UserModel.update(
      { _id: req.body.id },
      { $set: { 'password': hashPwd } }
    );
    return res.status(200).json({ message: 'Password has been changed successfully!' });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
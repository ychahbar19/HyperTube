// EXPRESS CONTROLLER for User

/* -------------------------------------------------------------------------- *\
    1) Imports the required elements (model + node package).
\* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- *\
    2) Defines the signup, signin & logout functions.
\* -------------------------------------------------------------------------- */

/* ------------------------ SIGNUP ------------------------ */

exports.signupInputsValidation = (req, res, next) =>
{
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

exports.createUser = async (req, res, next) =>
{
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
exports.activateAccount = async (req, res, next) =>
{
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

/*
exports.signup = (req, res) =>
{
  //Applies bcrypt's hash on the password in 10 steps (= lvl of security),
  //then creates a new instance of UserModel and saves it in the DB.
  bcrypt.hash(req.body.password, 10)
    .then(hash =>
    {
      const newUser = new UserModel(
      {
        email: req.body.email,
        username: req.body.username,
        avatar: req.body.avatar,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: hash
      });
      newUser.save()
        .then(() => res.status(201).json({ message: 'User cree' }))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
};
*/

/* ------------------------ SIGNIN ------------------------ */

exports.loginInputsValidation = (req, res, next) =>
{
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

exports.login = async (req, res, next) =>
{
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

/*
exports.signin = (req, res) =>
{
  //Finds the user matching the given username and, if there is one,
  //compares the password entered with the user's hashed password.
  //If the comparison returns TRUE, defines a user token.
  UserModel.findOne({ email: req.body.username })
    .then(user =>
    {
      if (!user)
      {
        return res.status(401).json({ error: 'User not found' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid =>
        {
          if (!valid)
          {
            return res.status(401).json({ error: 'Bad password' });
          }
          res.status(200).json(
          {
            //.sign de jsonwebtoken permet de créer un token sur base de l'id user en payload
            //(= données encodées dans le token au moyen de la chaîne secrète)
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' })
          });
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
};
*/

/* ------------------------ LOGOUT ------------------------ */

/*
exports.logout = (req, res) =>
{
  req.logout();
  req.session.destroy();
  res.redirect('http://localhost:4200/');
};
*/

/* -------------------------------------------------------------------------- *\
    3) 
\* -------------------------------------------------------------------------- */

/*
exports.getCurrentUser = (req, res) =>
{
  console.log(req);
  res.send('ok');
};

exports.getUserInfo = (req, res, next) =>
{
  res.send('user info');
};
*/

// Random string to reset password
exports.createRandomStr = async (req, res, next) =>
{
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
// get user informations (HYDRATATION)

exports.getUserInfo = async (req, res, next) => {
  let error = false;
  let id;

  try {
    if (!req.body.id) {
      id = req.userToken.userId;
    } else {
      id = req.body.id;
    }
      
    const oUserId = ObjectId(id);
    const userInfo = await UserModel.findOne({_id: oUserId});
    if (!userInfo)
      return res.status(401).json({
        message: "Oops ! User not found !"
      });
    const humanReadName = userInfo.firstName + ' ' + userInfo.lastName;
    return res.status(200).json({
      avatar: userInfo.avatar,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      username: userInfo.username,
      email: userInfo.email,
      humanReadName: humanReadName,
      message: 'get user successfully !'
    });
  } catch(err) {
    res.status(500).send(err);
  }
}

// update user : 
exports.updateUser = async (req, res, next) => {
  let error = false;

  try {
    const url = req.protocol + "://" + req.get("host");
    let userToken;
    let updateData = new Object;
    if (req.userToken)
    {
      userToken = req.userToken;
      updateData.userId = userToken.userId;
    }
    const oUserId = ObjectId(userToken.userId);
    
    if (req.body.firstName)
      updateData.firstName = req.body.firstName;
    if (req.body.lastName)
      updateData.lastName = req.body.lastName;
    if (req.body.avatar)
      updateData.avatar = url + "/assets/pictures/" + req.body.avatar;
    if (req.body.username)
      updateData.username = req.body.username;
    if (req.body.email)
      updateData.email = req.body.email;
    // error
    if (!updateData)
      return res.status(403).json({ message: 'An error occured !' });
    await UserModel.updateOne({_id: oUserId}, {
      $set: updateData
    });
    // to remove the email key from my object (don't need it in my updated Token)
    delete updateData.email; 
    res.updatedDataToToken = updateData;
    return next();
  } catch (err) {
      return res.status(500).send(err);
  }
};

exports.updateToken = async (req, res, next) => {
  const data = req.res.updatedDataToToken;
  try {
    const token = jwt.sign(data, 'secret_this_should_be_longer', { expiresIn: '10h' });
    return res.status(200).json({
      message: 'user updated !',
      token: token,
      expiresIn: 36000
    });
  } catch (err) {
      return res.status(500).send(err);
  }
}
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
  let error = false;
  // check if user exists in db
  try {
    const foundUser = await UserModel.findOne({ username: req.body.username });
    if (!foundUser) {
      error = true;
      return res.status(401).json({ message: 'The username doesn\'t belong to any account. Please create an account' });
    }
    const samePwds = await bcrypt.compare(req.body.password, foundUser.password);
    if (!samePwds) {
      error = true;
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
    const savedUser = await user.save();
    res.status(201).json({
      message: 'User created',
      result: savedUser
    })
  } catch (err) {
    res.status(500).send(err);
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

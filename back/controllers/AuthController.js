/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ObjectId = require('mongodb').ObjectId;
const UserModel = require('../models/UserModel');

// Defines validation patterns and a function to compare inputs with them.
const emailPattern = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)+$');
const usernamePattern = new RegExp('^[a-zA-Z0-9]{6,33}$');
const passwordPattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,33}$');

function validPattern(str, pattern) {
  return (pattern.test(str));
}

// Defines the password crypting and comparison methods
async function cryptPwd(password) {
  const cryptedPwd = await bcrypt.hash(password, 10); // Applies bcrypt's hash on the password in 10 steps (=lvls of security.
  return cryptedPwd;
}
async function isSamePwds(password_input, password_db) {
  const isSame = await bcrypt.compare(password_input, password_db);
  return isSame;
}

/* -------------------------------------------------------------------------- *\
    2) Defines SIGNUP functions.
\* -------------------------------------------------------------------------- */

/* ------------------------ SIGNUP (step 1) ------------------------ */
// Checks that the input fields (names, email, password) are valid.

exports.signupInputsValidation = (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (email == null || !validPattern(email, emailPattern) ||
      username == null || !validPattern(username, usernamePattern) ||
      password == null || !validPattern(password, passwordPattern))
    return res.status(403).json({ message: 'An error occured !' });

  if (password !== confirmPassword)
    return res.status(403).json({ message: 'Passwords do not match' });

  return next();
};

/* ------------------------ SIGNUP (step 2) ------------------------ */
// Creates a new instance of UserModel and saves it in the database,
// or splits the errors into a custom array of field=>type for each error.

exports.createUser = async (req, res, next) => {
  try {
    const hashPwd = await cryptPwd(req.body.password);
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
  }
  catch (e) {
    let errors_array = {};
    
    if (typeof e.errors.username !== 'undefined')
      errors_array.username = e.errors.username.kind;
    if (typeof e.errors.email !== 'undefined')
      errors_array.email = e.errors.email.kind;

    return res.status(500).json({ errors_array: errors_array });
  }
};

/* ------------------------ ACTIVATE ACCOUNT ------------------------ */
// Updates the user, defining it as active.

exports.activateAccount = async (req, res) => {
  try {
    // Fetches the user from the db, if it exists.
    const oUserId = ObjectId(req.body.id);
    const foundUser = await UserModel.findOne({ _id: oUserId, active: false });
    if (!foundUser)
      return res.status(401).json({ message: 'Oops ! Something went wrong !' });

    // Updates the user to set it as active.
    await UserModel.updateOne({ '_id': oUserId }, { $set: { 'active': true } });
    return res.status(200).json({ message: 'Account activated' });
  }
  catch (e)
  {
    let errors_array = {};
    console.log('********', e, '--------', e.message)
    errors_array.message = e;
    res.status(500).json({ errors_array: errors_array });
  }
};

/* -------------------------------------------------------------------------- *\
    3) Defines SIGNIN functions.
\* -------------------------------------------------------------------------- */

/* ------------------------ SIGNIN (step 1) ------------------------ */
// Checks that the input fields (username & password) are valid.

exports.loginInputsValidation = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username == null || !validPattern(username, usernamePattern) ||
      password == null || !validPattern(password, passwordPattern))
    return res.status(403).json({ message: 'An error occured !' });
  return next();
};

/* ------------------------ SIGNIN (support) ------------------------ */
// Generates user token and returns it (jsonwebtoken's sign() creates
// a crypted token using the data given in payload and a secret string).

exports.generateLogToken = userInstance => {
  const token = jwt.sign(
    {
      userId: userInstance._id,
      firstName: userInstance.firstName,
      lastName: userInstance.lastName,
      username: userInstance.username
    },
    'secret_this_should_be_longer',
    { expiresIn: '10h' }
  );
  return { token: token, expiresIn: 36000 };
}

/* ------------------------ SIGNIN (step 2) ------------------------ */
// Checks that the input fields match a user and returns a token.

exports.login = async (req, res) => {
  try {
    //  1. Fetches the user from the db, if it exists.
    const foundUser = await UserModel.findOne({ username: req.body.username });
    if (!foundUser)
      return res.status(401).json({ message: 'The username doesn\'t belong to any account. Please create an account' });
    
    //  2. Checks the user & signin passwords match.
    const samePwds = await isSamePwds(req.body.password, foundUser.password);
    if (!samePwds)
      return res.status(401).json({ message: 'The password is incorrect. Please try again !' });

    //  3. Generates the unique token.
    const token = this.generateLogToken(foundUser);
    return res.status(200).json(token);
  }
  catch (error) { return res.status(500).send(error); }
};

/* -------------------------------------------------------------------------- *\
    4) Defines FORGOTTEN PASSWORD functions.
\* -------------------------------------------------------------------------- */

/* ------------------------ FORGOTTEN PASSWORD ------------------------ */
// Assigns a random string to the user, to be used in RESET PASSWORD.

exports.createRandomStr = async (req, res, next) => {
  try {
    // Fetches the user from the db, if it exists.
    req.user = await UserModel.findOne({ username: req.body.username });
    if (!req.user)
      return res.status(401).json({ message: 'User not found in database !'});
    
    // Generates a random string for the user and updates the database.
    crypto.randomBytes(20, async (error, buffer) =>
    {
      if (error)
        return res.status(400).json({ message: 'Couldn\'t create a reset hash !'});
      res.locals.randomStr = buffer.toString('hex');
      await UserModel.updateOne(
        { username: req.user.username },
        { $set: { active: false, randomStr: res.locals.randomStr }}
      );
      next();
    });
  }
  catch (error) { return res.status(500).json({ message: error }); }
};

/* ------------------------ RESET PASSWORD (step 1) ------------------------ */
// Fetches the user for the password reset, if it exists.

exports.checkIdAndHash = async (req, res, next) => {
  try {
    const foundUser = await UserModel.findOne({ _id: req.body.id, randomStr: req.body.hash });
    if (!foundUser)
      return res.status(401).json({ message: 'Oops! Something went wrong' });
    next();
  }
  catch (error) { return res.status(500).json({ message: error }); }
};

/* ------------------------ RESET PASSWORD (step 2) ------------------------ */
// Checks the new password is valid.

exports.checkPassword = (req, res, next) => {
  const password = req.body.formData.password;
  const confirmPassword = req.body.formData.confirmPassword;

  if (password == null || !validPattern(password, passwordPattern))
    return res.status(403).json({ message: "An error occured !" });

  if (password !== confirmPassword)
    return res.status(403).json({ message: "Passwords do not match" });

  next();
};

/* ------------------------ RESET PASSWORD (step 3) ------------------------ */
// Hashes and saves the user's new password.

exports.resetPwd = async (req, res) => {
  try {
    const hashPwd = await cryptPwd(req.body.formData.password);

    await UserModel.updateOne(
      { _id: req.body.id },
      {
        $set: { active: true, password: hashPwd },
        $unset: { randomStr: 1 }
      }
    );
    return res.status(200).json({ message: 'Password has been changed successfully!' });
  }
  catch (error) { return res.status(500).json({ message: error }); }
};

/* -------------------------------------------------------------------------- *\
    5) Defines LOGOUT functions.
\* -------------------------------------------------------------------------- */

/* ------------------------ LOGOUT ------------------------ */

/*
exports.logout = (req, res) =>
{
  req.logout();
  req.session.destroy();
  res.redirect('http://localhost:4200/');
};
*/

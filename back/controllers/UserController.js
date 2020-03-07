const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const UserModel = require('../models/UserModel');

let inputErrors = [];
const usernamePattern = new RegExp('^[a-zA-Z0-9]{6,33}$');
const passwordPattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,33}$');
const emailPattern = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$');

function validPattern(str, pattern) {
  if (pattern.test(str))
    return true;
  return false;
}

exports.userExists = async (req, res, next) => {
  console.log(req.body);
  // try {
  //   const user = await UserModel.findOne({ email: req.body.profile.getEmail() });
  //   if (!user) {
  //     return res.status(200).send('nonexistant');
  //   }
  //   res.status(200).send('existant');
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).send(err)
  // }
}

// sign in

exports.loginValidation = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username == null)
    inputErrors.push('USR_REQ');
  if (!validPattern(username, usernamePattern))
    inputErrors.push('USR_PATTERN');
  if (password == null)
    inputErrors.push('PWD_REQ');
  if (!validPattern(password, passwordPattern))
    inputErrors.push('PWD_PATTERN');

  if (inputErrors.length)
    return res.status(403).json(inputErrors);
  return next();
};

exports.login = async (req, res, next) => {
  // check if user exists in db
  try {
    const foundUser = await UserModel.findOne({ username: req.body.username });
    if (!foundUser) {
      inputErrors.push('USR_NOT_EXISTS');
      return res.status(401).json(inputErrors);
    }
    const samePwds = await bcrypt.compare(req.body.password, foundUser.password);
    if (!samePwds) {
      inputErrors.push('USR_NOT_EXISTS');
      return res.status(401).json(inputErrors);
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
    console.log(err);
    res.status(500).send(err);
  }
};

// sign up

exports.signupValidation = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const email = req.body.email;

  // checker les inputs firstName, lastName, ..
  if (username == null)
    inputErrors.push('USR_REQ');
  if (!validPattern(username, usernamePattern))
    inputErrors.push('USR_PATTERN');
  if (password == null)
    inputErrors.push('PWD_REQ');
  if (!validPattern(password, passwordPattern))
    inputErrors.push('PWD_PATTERN');
  if (!validPattern(email, emailPattern))
    inputErrors.push('EMAIL_PATTERN');
  if (password !== confirmPassword)
    inputErrors.push('PWD_MATCH');

  if (inputErrors.length)
    return res.status(403).json(inputErrors);
  return next();
};

exports.createUser = async (req, res, next) => {
  try {
    const hashPwd = await bcrypt.hash(req.body.password, 10);
    const user = new UserModel({
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
    console.log(err);
    res.status(500).send(err);
  }
  
};















// SIGNUP MIDDLEWARES

// set where to stock our uploaded images

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//       cb(null, 'assets/pictures');
//   },

//   // By default, multer removes file extensions so let's add them back
//   filename: function(req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// const fileFilter = function(req, file, callback) {
//   if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
//       req.fileValidationError = 'Only image files are allowed!';
//       return callback(new Error('Only image files are allowed!'), false);
//   }
//   callback(null, true);
// };

// exports.utils(req, res, function(err){

//   let upload = multer({ storage : storage, fileFilter: fileFilter })

//   upload(req, res, (err) => {
//     if (req.fileValidationError) {
//       return res.status(403).send(req.fileValidationError);
//     }
//     else if (!req.file) {
//         return res.status(403).send('Please select an image to upload');
//     }
//     else if (err instanceof multer.MulterError) {
//         return res.status(403).send(err);
//     }
//     else if (err) {
//         return res.status(403).send(err);
//     }

//     const data = req.file.path;
//     console.log(data);
    
//     return res.status(200).json(data);
//   });

// });

// exports.checkSignUpInput = (req, res, next) => {
//   const user = req.body;

//   // imageURL

//   // name
//   // firstname
//   // username
//   // email
//   // password
//   // confirmPassword

//   if (user.username == null) {
//     inputErrors.push('USR_REQ');
//   }
//   if (!validLength(username.length, 6)) {
//     inputErrors.push('USR_LEN');
//   }
//   if (!validPattern(username, /[a-zA-Z0-9]+$/)) {
//     inputErrors.push('USR_PATTERN');
//   }
//   if (password == null) {
//     inputErrors.push('PWD_REQ');
//   }
//   if (!validLength(password.length, 8)) {
//     inputErrors.push('PWD_LEN');
//   }
//   if (!validPattern(password, /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/)) {
//     inputErrors.push('PWD_PATTERN');
//   }

//   if (inputErrors.length) {
//     return res.status(403).json(inputErrors);
//   }
//   return next();


// }


// signin() {
//   appel bdd pour set user a loggedIn
// }


// module.exports = UserController;
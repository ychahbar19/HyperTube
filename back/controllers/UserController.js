const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const multer = require('multer');

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

// SIGNUP MIDDLEWARES

// set where to stock our uploaded images

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'assets/pictures');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = function(req, file, callback) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
      return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

exports.utils(req, res, function(err){

  let upload = multer({ storage : storage, fileFilter: fileFilter })

  upload(req, res, (err) => {
    if (req.fileValidationError) {
      return res.status(403).send(req.fileValidationError);
    }
    else if (!req.file) {
        return res.status(403).send('Please select an image to upload');
    }
    else if (err instanceof multer.MulterError) {
        return res.status(403).send(err);
    }
    else if (err) {
        return res.status(403).send(err);
    }

    const data = req.file.path;
    console.log(data);
    
    return res.status(200).json(data);
  });

});

exports.checkSignUpInput = (req, res, next) => {
  const user = req.body;

  // imageURL

  // name
  // firstname
  // username
  // email
  // password
  // confirmPassword

  if (user.username == null) {
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


}


// signin() {
//   appel bdd pour set user a loggedIn
// }


// module.exports = UserController;
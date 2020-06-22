/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const ObjectId = require('mongodb').ObjectId;
const UserModel = require('../models/UserModel');
const CommentModel = require('../models/CommentModel');
const VideoModel = require('../models/VideoModel');

/* -------------------------------------------------------------------------- *\
    2) Defines the user-related functions.
\* -------------------------------------------------------------------------- */

/* ------------------------ READ ------------------------ */

// Gets the user's personal information
exports.getUserInfo = async (req, res) => {
  try {
    let id = (!req.params.user_id) ? req.userToken.userId : req.params.user_id;
    const userInfo = await UserModel.findOne({ _id: ObjectId(id) });
    if (!userInfo)
      return res.status(401).json({ message: "Oops ! User not found !" });

    let userComments = await CommentModel.find({ author_id: id }).sort({ posted_datetime: -1 });
    const len = userComments.length;
    for (let i = 0; i < len; i++) {
      const results = await axios.get('http://www.omdbapi.com/?apikey=82d3568e&i=' + userComments[i].imdbId);
      userComments[i].videoInfo = new VideoModel(results.data);
    }

    return res.status(200).json({
      user_id: id,
      avatar: userInfo.avatar,
      language: userInfo.language,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      username: userInfo.username,
      email: userInfo.email,
      movieHistory: userInfo.movieHistory,
      comments: userComments
    });
  }
  catch(error) { res.status(500).json({ status: 500, datas: null, message: error }); }
}

/* ------------------------ UPDATE ------------------------ */

// Updates the user's personal information
exports.updateUser = async (req, res, next) => {
  try {
    const url = req.protocol + '://' + req.get('host');
    let userToken;
    let updateData = new Object;
    userToken = req.userToken;
    updateData.userId = userToken.userId;
    const oUserId = ObjectId(userToken.userId);

    let user = await UserModel.findOne({ username: req.body.username });
    if (user && req.body.username !== userToken.username)
      return res.status(403).json({ status: 403, datas: null, message: 'Username exists' });
    user = await UserModel.findOne({ email: req.body.email });
    if (user && req.body.email !== userToken.email) {
      console.log('VMT ?');
      return res.status(403).json({ status: 403, datas: null, message: 'Email exists' });
    }

    if (req.body.avatar)
      updateData.avatar = url + '/assets/pictures/' + req.body.avatar;
    updateData.language = req.body.language;
    updateData.firstName = req.body.firstName;
    updateData.lastName = req.body.lastName;
    updateData.username = req.body.username;
    updateData.email = req.body.email;
    hashPwd = await bcrypt.hash(req.body.password, 10);
    updateData.password = hashPwd;

    await UserModel.updateOne({_id: oUserId}, { $set: updateData });
    
    // Removes the email & password from the object since we don't need them in the updated Token.
    delete updateData.language;
    delete updateData.password;
    delete updateData.confirmPassword;
    res.updatedDataToToken = updateData;
    return next();
  }
  catch (error) { return res.status(500).json({ status: 500, datas: null, message: error }); }
};

// updates token with new informations about user and takes remaining time for the expiration
exports.updateToken = async (req, res, next) => {
  const data = req.res.updatedDataToToken;
  try {
    const token = jwt.sign(data, 'secret_this_should_be_longer', { expiresIn: parseInt(req.body.remainingTime, 10) });
    return res.status(200).json({
      token: token,
      expiresIn: parseInt(req.body.remainingTime, 10)
    });
  } catch (error) {
      return res.status(500).json({ status: 500, datas: null, message: error });
  }
};

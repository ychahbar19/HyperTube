/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

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
    const id = (!req.params.user_id) ? req.userToken.userId : req.params.user_id;
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
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      username: userInfo.username,
      email: userInfo.email,
      movieHistory: userInfo.movieHistory,
      //humanReadName: userInfo.firstName + ' ' + userInfo.lastName,
      //message: 'get user successfully !'
      comments: userComments
    });
  } catch(err) {
    res.status(500).send(err);
  }
}

/* ------------------------ UPDATE ------------------------ */

// Updates the user's personal information
exports.updateUser = async (req, res, next) => {
  try {
    const url = req.protocol + "://" + req.get("host");
    let userToken;
    let updateData = new Object;
    if (req.userToken) {
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
    await UserModel.updateOne({_id: oUserId}, { $set: updateData });
    
    // to remove the email key from my object (don't need it in my updated Token)
    delete updateData.email; 
    res.updatedDataToToken = updateData;
    return next();
  }
  catch (err) { return res.status(500).send(err); }
};

// updates token with new informations about user and takes remaining time for the expiration
exports.updateToken = async (req, res, next) => {
  const data = req.res.updatedDataToToken;
  try {
    const token = jwt.sign(data, 'secret_this_should_be_longer', { expiresIn: parseInt(req.body.remainingTime, 10) });
    return res.status(200).json({
      token: token,
      expiresIn: parseInt(req.body.expiresIn, 10)
    });
  } catch (err) {
      return res.status(500).send(err);
  }
};

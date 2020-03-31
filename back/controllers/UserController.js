/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;
const UserModel = require('../models/UserModel');

/* -------------------------------------------------------------------------- *\
    2) Defines the xxxxxxxxxx-related functions.
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
    await UserModel.updateOne({_id: oUserId}, { $set: updateData });
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
};

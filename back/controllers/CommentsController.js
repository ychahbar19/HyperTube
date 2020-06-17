/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const ObjectId = require('mongodb').ObjectId;
const CommentModel = require('../models/CommentModel');
const UserModel = require('../models/UserModel');

/* -------------------------------------------------------------------------- *\
    2) CRUD functions.
\* -------------------------------------------------------------------------- */

/* ------------------------ CREATE ------------------------ */

exports.create = (req, res) => {
  const commentPosted = req.body;

  //Creates a new object based on the model and from the posted data.
  const comment = new CommentModel({
    //Copies all the fields from the posted data and uses them to fill the model.
    ...commentPosted,
    //Add the time
    posted_datetime: Date.now(),
    author_id: req.userToken.userId
  });

  //Uses mongoose's .save method to save the new object in the database
  //(this uses the .then .catch structure because it's asynchronous).
  comment.save()
    .then(() => res.status(201).json({ message: 'OK' }))
    .catch(error => res.status(400).json({ error }))
};

/* ------------------------ READ ------------------------ */

exports.read = async (req, res) => {
  let comments = await CommentModel
                        .find({ imdbId: req.params.video_imdb_id, language: req.params.language })
                        .sort({ posted_datetime: -1 });
  const len = comments.length;

  for (let i = 0; i < len; i++) {
    let user = await UserModel.findOne({ _id: ObjectId(comments[i].author_id) })
    if (user) {
      comments[i].author_avatar = user.avatar;
      comments[i].author_username = user.username;
    } else { // If user is deleted manually -> comments are still in DB
      comments[i].author_avatar = 'http://localhost:3000/assets/pictures/noun_deleted_user.png';
      comments[i].author_username = null;
    }
  }
  res.status(200).json(comments);
};

/* ------------------------ UPDATE ------------------------ */
/*
exports.update = (req, res) =>
{
  //Updates the object that matches the id given as route parameter (:id),
  //with the new version of this object, but keeping it's current id.
  CommentModel.updateOne
  (
    { _id: req.params.id },
    { ...req.body, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Comment modified.'}))
    .catch(error => res.status(400).json({ error }));
};
*/
/* ------------------------ DELETE ------------------------ */
/*
exports.delete = (req, res) =>
{
  CommentModel.deleteOne
  (
    { _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Comment deleted.'}))
    .catch(error => res.status(400).json({ error }));
};
*/

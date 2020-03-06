const CommentModel = require('../models/CommentModel');

/* ------------------------------------------------------------------------ *\
    CRUD functions
\* ------------------------------------------------------------------------ */

/* ------------------------ CREATE ------------------------ */
exports.create = (req, res) =>
{
  // Gets the data from POST.
  const commentPosted = JSON.parse(req.body.thing);

  //Deletes the id from the request body (since mongodb will generate another).
  delete commentPosted._id;

  //Creates a new object based on the model and from the posted data.
  const comment = new CommentModel(
  {
    //Copies all the fields from the posted data and uses them to fill the model.
    //Alternative: { name: commentPosted.author_name, etc. }
    ...commentPosted,
  });

  //Uses mongoose's .save method to save the new object in the database
  //(this uses the .then .catch structure because it's asynchronous).
  comment.save()
    .then(() => res.status(201).json({ message: 'Comment created.' }))
    .catch(error => res.status(400).json({ error }))
};

/* ------------------------ READ ------------------------ */
exports.read = (req, res) =>
{
  CommentModel.find
  (
    { imdb_id: req.params.video_imdb_id }
  )
    .then(comments => res.status(200).json(comments))
    .catch(error => res.status(400).json({ error }));
};

/* ------------------------ UPDATE ------------------------ */
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

/* ------------------------ DELETE ------------------------ */
exports.delete = (req, res) =>
{
  CommentModel.deleteOne
  (
    { _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Comment deleted.'}))
    .catch(error => res.status(400).json({ error }));
};

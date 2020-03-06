const VideoModel = require('../models/VideoModel');

/* ------------------------------------------------------------------------ *\
    CRUD functions
\* ------------------------------------------------------------------------ */

/* ------------------------ CREATE ------------------------ */
exports.create = (req, res, next) =>
{
  // Gets the data from POST.
  const videoPosted = JSON.parse(req.body.thing);

  //Deletes the id from the request body (since mongodb will generate another).
  delete videoPosted._id;

  //Creates a new object based on the model and from the posted data.
  const video = new VideoModel(
  {
    //Copies all the fields from the posted data and uses them to fill the model.
    //Alternative: { name: videoPosted.name, lastSeenTimestamp: etc. }
    ...videoPosted,
  });

  //Uses mongoose's .save method to save the new object in the database
  //(this uses the .then .catch structure because it's asynchronous).
  video.save()
    .then(() => res.status(201).json({ message: 'Video created.' }))
    .catch(error => res.status(400).json({ error }))
};

/* ------------------------ READ ------------------------ */
exports.readAll = (req, res, next) =>
{
  VideoModel.find()
    .then(videos => res.status(200).json(videos))
    .catch(error => res.status(400).json({ error }));
};

exports.readOne = (req, res, next) =>
{
  VideoModel.findOne
  (
    { _id: req.params.id }
  )
    .then(video => res.status(200).json(video))
    .catch(error => res.status(404).json({ error }));
};

/* ------------------------ UPDATE ------------------------ */
exports.update = (req, res, next) =>
{
  //Updates the object that matches the id given as route parameter (:id),
  //with the new version of this object, but keeping it's current id.
  VideoModel.updateOne
  (
    { _id: req.params.id },
    { ...req.body, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Video modified.'}))
    .catch(error => res.status(400).json({ error }));
};

/* ------------------------ DELETE ------------------------ */
exports.delete = (req, res, next) =>
{
  VideoModel.deleteOne
  (
    { _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Video deleted.'}))
    .catch(error => res.status(400).json({ error }));
};

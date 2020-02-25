const VideoModel = require('../models/VideoModel');

/* ----- CRUD functions ----- */

exports.create = (req, res, next) =>
{
  // Get the data from POST.
  /////////here static to test
  const video = new VideoModel(
  {
    name: 'Some title',
    lastSeenTimestamp: 0,
    summary: 'Some synopsis'
  });

  video.name = "Modified name";

  // Save the data in the database.
  video.save()
    .then(() => res.status(201).json({ message: 'Video created.' }))
    .catch(error => res.status(400).json({ error }))
};

exports.read = (req, res, next) =>
{
  res.json({ message: 'Req to /api/video/read' });
};

exports.update = (req, res, next) =>
{
  res.json({ message: 'Req to /api/video/update' });
};

exports.delete = (req, res, next) =>
{
  res.json({ message: 'Req to /api/video/delete' });
};

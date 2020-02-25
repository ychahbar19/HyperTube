//Imports node's mongoose (=database) package.
const mongoose = require('mongoose');

//Creates the model for videos, as a database schema.
var VideoSchema = new mongoose.Schema(
{
  name: { type: String, required: true },
  lastSeenTimestamp: { type: Number, required: true },
  pic: String,
  summary: String,
  genre: String,
  productionYear: Number,
  durationSeconds: Number,
  ratingAverage: Number,
  director: String,
  actors: Array
});

//Export the model.
module.exports = mongoose.model('VideoModel', VideoSchema);

// MODEL for Video

//Imports node's mongoose package (=database).
const mongoose = require('mongoose');

//Creates the model for videos, as a database schema.
var VideoSchema = new mongoose.Schema(
{
  field_1: String,
  field_2: String,
  field_3: String
});

//Exports the model.
module.exports = mongoose.model('VideoModel', VideoSchema);

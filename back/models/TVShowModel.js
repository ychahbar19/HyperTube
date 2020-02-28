// MODEL for Movie

//Imports node's mongoose package (=database).
const mongoose = require('mongoose');

//Creates the model for videos, as a database schema.
var TVShowSchema = new mongoose.Schema(
{
  field_1: String,
  field_2: String,
  field_3: String
});

//Exports the model.
module.exports = mongoose.model('TVShowModel', TVShowSchema);

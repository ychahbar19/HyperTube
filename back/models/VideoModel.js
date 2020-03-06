// 1) Import
const mongoose = require('mongoose');

// 2) Define
var VideoSchema = new mongoose.Schema(
{
  imdbID: String,
  Type: String,
  Title: String,
  Poster: String,
  imdbRating: Number,
  imdbVotes: String,
  Genre: String,
  Year: String,
  Runtime: String,
  Plot: String,
  Director: String,
  Writer: String,
  Production: String,
  Actors: String
});

// 3) Export
module.exports = mongoose.model('VideoModel', VideoSchema);

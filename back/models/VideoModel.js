// 1) Import
const mongoose = require('mongoose');

// 2) Define
var VideoTorrentsSchema = new mongoose.Schema(
{
  url: String,
  hash: String,
  quality: String,
  type: String,
  seeds: Number,
  peers: Number,
  size: String,
  size_bytes: Number,
  date_uploaded: String,
  date_uploaded_unix: Number,
  year_uploaded: Number,
  title: String
});

var VideoSchema = new mongoose.Schema(
{
  imdbID: String,
  Title: String,
  title: String, //Translated title, from TMDB
  Poster: String,
  imdbRating: Number,
  imdbVotes: String,
  Genre: String,
  Year: String,
  Runtime: String,
  Plot: String,
  overview: String, //Translated plot, from TMDB
  Director: String,
  Writer: String,
  Production: String,
  Actors: String,
  Torrents: [VideoTorrentsSchema]
});

// 3) Export
module.exports = mongoose.model('VideoModel', VideoSchema);
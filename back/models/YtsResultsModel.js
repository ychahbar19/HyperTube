// 1) Import
const mongoose = require('mongoose');

// 2) Define
var YtsTorrentSchema = new mongoose.Schema(
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
  date_uploaded_unix: Number
});

var YtsMovieSchema = new mongoose.Schema(
{
  id: Number,
  url: String,
  imdb_code: String,
  title: String,
  title_english: String,
  title_long: String,
  slug: String,
  year: Number,
  rating: Number,
  runtime: Number,
  genres: [String],
  summary: String,
  description_full: String,
  synopsis: String,
  yt_trailer_code: String,
  language: String,
  mpa_rating: String,
  background_image: String,
  background_image_original: String,
  small_cover_image: String,
  medium_cover_image: String,
  large_cover_image: String,
  state: String,
  torrents: [YtsTorrentSchema],
  date_uploaded: String,
  date_uploaded_unix: Number
});

var YtsResultsDataSchema = new mongoose.Schema(
{
  movie_count: Number,
  limit: Number,
  page_number: Number,
  movies: [YtsMovieSchema]
});

var YtsResultsSchema = new mongoose.Schema(
{
  status: String,
  status_message: String,
  data: YtsResultsDataSchema
});

// 3) Export
module.exports = mongoose.model('YtsResultsModel', YtsResultsSchema);

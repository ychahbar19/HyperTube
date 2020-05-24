// 1) Import
const mongoose = require('mongoose');

// 2) Define
const DownloadedMovieSchema = mongoose.Schema({
  movieName: { type: String, required: true },
  quality: { type: String, required: true},
  type: { type: String, required: true },
  extension: { type: String, required: true },
  status: { type: String, required: true }
});

// 3) Export
module.exports = mongoose.model('DownloadedMovieModel', DownloadedMovieSchema);
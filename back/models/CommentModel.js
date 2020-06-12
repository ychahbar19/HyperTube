// 1) Import
const mongoose = require('mongoose');

// 2) Define
var CommentSchema = new mongoose.Schema(
{
  imdb_id: String,
  yts_id: String,
  posted_datetime: Date,
  content: String,
  language: String,
  author_id: String,
  author_avatar: String,
  author_username: String,
  videoInfo: {}
});

// 3) Export
module.exports = mongoose.model('CommentModel', CommentSchema);

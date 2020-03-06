// 1) Import
const mongoose = require('mongoose');

// 2) Define
var CommentSchema = new mongoose.Schema(
{
  imdb_id: String,
  author_name: String,
  posted_datetime: String,
  content: String
});

// 3) Export
module.exports = mongoose.model('CommentModel', CommentSchema);

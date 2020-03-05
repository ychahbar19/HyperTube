// 1) Import
const mongoose = require('mongoose');

// 2) Define
var ResultSchema = new mongoose.Schema(
{
  imdb_id: String,
  title: String
});

// 3) Export
module.exports = mongoose.model('ResultModel', ResultSchema);

// 1) Import
const mongoose = require('mongoose');

// 2) Define
var VideoSchema = new mongoose.Schema(
{
  field_1: String,
  field_2: String,
  field_3: String
});

// 3) Export
module.exports = mongoose.model('VideoModel', VideoSchema);

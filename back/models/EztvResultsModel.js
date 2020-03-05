// 1) Import
const mongoose = require('mongoose');

// 2) Define
var EztvTorrentSchema = new mongoose.Schema(
{
  id: Number,
  hash: String,
  filename: String,
  episode_url: String,
  torrent_url: String,
  magnet_url: String,
  title: String,
  imdb_id: String,
  season: String,
  episode: String,
  small_screenshot: String,
  large_screenshot: String,
  seeds: Number,
  peers: Number,
  date_released_unix: Number,
  size_bytes: String
});

var EztvResultsSchema = new mongoose.Schema(
{
  torrents_count: Number,
  limit: Number,
  page: Number,
  torrents: [EztvTorrentSchema]
});

// 3) Export
module.exports = mongoose.model('EztvResultsModel', EztvResultsSchema);

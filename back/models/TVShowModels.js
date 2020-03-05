// MODEL for TVShow

//Imports node's mongoose package (=database).
const mongoose = require('mongoose');

//Creates the models for TV shows from EZTV, as database schemas.
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

var EztvSchema = new mongoose.Schema(
{
  torrents_count: Number,
  limit: Number,
  page: Number,
  torrents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EztvTorrentSchema' }]
});

//Exports the models.
module.exports = mongoose.model('EztvModel', EztvSchema);

/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const axios = require('axios');
const VideoModel = require('../models/VideoModel');
const torrentStream = require('torrent-stream');


let videoInfo = {};

/* -------------------------------------------------------------------------- *\
    2) Private functions.
\* -------------------------------------------------------------------------- */

//Gets the video's info from The Open Movie Database (OMDb)'s API.
async function getInfo(imdb_id)
{
  await axios.get('http://www.omdbapi.com/?apikey=82d3568e&i='+imdb_id)
    .then(results =>
    {
      videoInfo = new VideoModel(results.data);
    })
    .catch(error => res.status(400).json({ error }));
};

//Gets the video's torrents from YTS' API.
async function getTorrents(yts_id)
{
  await axios.get('https://yts.mx/api/v2/movie_details.json?movie_id='+yts_id)
    .then(results =>
    {
      videoInfo.Torrents = results.data.data.movie.torrents;
      Object.entries(videoInfo.Torrents).forEach(item =>
      {
        let date = new Date(item[1].date_uploaded_unix * 1000);
        item[1].year_uploaded = date.getFullYear();
      });
    })
    .catch(error => res.status(400).json({ error }));
};

/* -------------------------------------------------------------------------- *\
    3) Public function and export.
\* -------------------------------------------------------------------------- */

//Calls the different sources and returns their combined results.
exports.getVideoInfo = async function getVideoInfo(req, res)
{
  await getInfo(req.params.imdb_id);
  if (req.params.yts_id)
    await getTorrents(req.params.yts_id);
  res.status(200).send(videoInfo);
};

/* -------------------------------------------------------------------------- *\
    4) download and stream torrent.
\* -------------------------------------------------------------------------- */

exports.StreamAndDownloadTorrent = async function StreamAndDownloadTorrent(req, res, next) { 
  let engine = torrentStream('magnet:?xt=urn:btih:' + req.body.hash, { path: '../videos' });
  
  engine.on("ready", function() {
    for (const file of engine.files) {
      if (
        file.name.substr(file.name.length - 3) === 'mkv' ||
        file.name.substr(file.name.length - 3) === 'mp4'
      ) {
        console.log(file.path);
        let stream = file.createReadStream();
        // stream is readable stream to containing the file content
        return res.status(200).json({ data: file.path });
      }
    }
    return res.status(404).json({ message: 'error undefined BGBG' });
  });
  engine.on("download", function(data) {
    console.log("       piece downloaded :", data);
  });
  engine.on("idle", function() {
    console.log("download ended !");
  });
};
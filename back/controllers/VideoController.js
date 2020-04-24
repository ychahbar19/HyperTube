/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const axios = require('axios');
const VideoModel = require('../models/VideoModel');
const torrentStream = require('torrent-stream');
const fs = require('fs');
const path = require('path');

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

// lists all files in dirPath (including files in subdir of dirPath)
const getAllFiles = (dirPath, arrayOfFiles) => {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  for (const file of files) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(file));
    }
  }

  return arrayOfFiles;
};

// Check if torrent is already downloaded on server
exports.checkDownloadedVids = (req, res, next) => {
  const path = 'assets/videos';
  const url = req.protocol + '://' + req.get('host');
  const engine = torrentStream('magnet:?xt=urn:btih:' + req.body.hash);
  engine.on('ready', () => {
    for (const file of engine.files) {
      if (
        file.name.substr(file.name.length - 3) === 'mkv' ||
        file.name.substr(file.name.length - 3) === 'mp4'
      ) {
        const arrayOfFiles = getAllFiles('./assets/videos');
        if (arrayOfFiles.includes(file.name)) {
          return res.status(200).json({
            status: 'success',
            src: url + '/' + path + '/' + file.path
          });
        } else {
          next();
        }
        break;
      }
    }
  });
};

exports.downloadTorrent = async (req, res, next) => {
  const path = 'assets/videos';
  const url = req.protocol + '://' + req.get('host');
  const engine = torrentStream('magnet:?xt=urn:btih:' + req.body.hash, { path: path });
  let response = {};
  let info;
  let readable = false;

  engine.on('ready', function() {
    for (const file of engine.files) {
      if (
        file.name.substr(file.name.length - 3) === 'mkv' ||
        file.name.substr(file.name.length - 3) === 'mp4'
      ) {
        info = file;
        let stream = file.createReadStream();
        response = {
          status: 'success',
          // path: file.path,
          src: url + '/' + path + '/' + file.path
        };
        console.log(file.length);
        // return ;
      } else
        file.deselect();
    }
    // return res.status(404).json({
    //   status: 'failure',
    //   path: null
    // });
  });
  engine.on('download', () => {
    console.log(Number.parseFloat(engine.swarm.downloaded / info.length).toPrecision(2) + '% done...');

    let div = engine.swarm.downloaded / info.length;
    if (!readable && div > 0.02) {
      readable = true;
      return res.status(200).json(response);
    }
  });

  engine.on('idle', function() {
    console.log('download ended');
  });
}

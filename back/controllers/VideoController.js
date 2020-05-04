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
  if (req.body.targetTime !== 0) {
    console.log('targetTime != 0 -> On ne regarde pas les dossiers du serveur');
    next();
  }
  else {
    console.log('targetTime = 0 -> On regarde les dossiers du serveur');
    engine.on('ready', () => {
      for (const file of engine.files) {
        if (
          file.name.substr(file.name.length - 3) === 'mkv' ||
          file.name.substr(file.name.length - 3) === 'mp4'
        ) {
          const arrayOfFiles = getAllFiles('./assets/videos');
          if (arrayOfFiles.includes(file.name)) {
            // continue telechargement potentiel
            return res.status(200).json({
              status: 'success',
              src: url + '/' + path + '/' + file.path,
            });
          } else {
            next();
          }
          break;
        }
      }
    });
  }
};

// Download the files from the torrent and return the source when 2% of the video has been downloaded
exports.downloadTorrent = async (req, res, next) => {
  const path = 'assets/videos';
  const url = req.protocol + '://' + req.get('host');
  const engine = torrentStream('magnet:?xt=urn:btih:' + req.body.hash, { path: path });
  let response = {};
  let fileCopy;
  let responseIsSent = false;

  engine.on('ready', function() {
    console.log('READYYYY');
    for (const file of engine.files) {
      if (
        file.name.substr(file.name.length - 3) === 'mkv' ||
        file.name.substr(file.name.length - 3) === 'mp4'
      ) {
        fileCopy = file;
        let startByte = Math.floor((req.body.targetTime / 100) * file.length);
        // check si startByte est deja telecharge.
        // Si non : on telecharge jusqu'a endByte et renvoie reponse + time dans la progress bar
        // Si oui : probleme (si error videojs) / OK -> vraie fin de film (si ended videojs)
        console.log(startByte, file.length);
        let endByte = file.length;
        file.createReadStream({ start: startByte, end: endByte });
        response = {
          status: 'success',
          // path: file.path,
          src: url + '/' + path + '/' + file.path
        };
      } else {
        console.log(file.name, file.length);
        file.deselect();
      }
    }
    // return res.status(404).json({
    //   status: 'failure',
    //   path: null
    // });
  });
  engine.on('download', () => {
    console.log(Number.parseFloat((engine.swarm.downloaded / fileCopy.length) * 100).toPrecision(2) + '% downloaded');

    let div = engine.swarm.downloaded / fileCopy.length;
    if (!responseIsSent && div > 0.02) {
      responseIsSent = true;
      return res.status(200).json(response);
    }
  });

  engine.on('idle', function() {
    console.log('download ended');
    if (!responseIsSent) {
      responseIsSent = true;
      return res.status(200).json(response);
    }
  });
}

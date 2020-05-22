/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const VideoModel = require('../models/VideoModel');

const axios = require('axios');
const torrentStream = require('torrent-stream');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const urljoin = require('url-join');
const rimraf = require('rimraf');

let videoInfo = {};
let downloadingVideo = [];

/* -------------------------------------------------------------------------- *\
    2) Private functions.
\* -------------------------------------------------------------------------- */

// Gets the video's info from The Open Movie Database (OMDb)'s API.
async function getInfo(imdb_id)
{
  await axios.get('http://www.omdbapi.com/?apikey=82d3568e&i=' + imdb_id)
    .then(results =>
    {
      videoInfo = new VideoModel(results.data);
    })
    .catch(error => res.status(400).json({ error })); // si erreur : res is not defined. Devrait return error pour que getVideoInfo send status 400
};

// Gets the video's torrents from YTS' API.
async function getTorrents(yts_id)
{
  await axios.get('https://yts.mx/api/v2/movie_details.json?movie_id=' + yts_id)
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

const pushToArray = (array, value) => {
  if (!array.includes(value)) array.push(value);
};

const deleteFromArray = (array, value) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      array.splice(i, 1);
      break;
    }
  }
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

// Check if torrent is already downloaded on server
exports.checkDownloadedVids = (req, res, next) => {
  if (req.body.targetPercent !== null) {
    return next();
  }
  const completePath = 'assets/videos/complete';
  const serverUrl = req.protocol + '://' + req.get('host');
  const engine = torrentStream('magnet:?xt=urn:btih:' + req.body.hash);
  engine.on('ready', () => {
    for (const file of engine.files) {
      file.deselect();
      if (
        file.name.substr(file.name.length - 3) === 'mkv' ||
        file.name.substr(file.name.length - 3) === 'mp4'
      ) {
        if (fs.existsSync(path.join(completePath, path.dirname(file.path)))) {
          return res.status(200).json({
            start: 0,
            status: 'complete',
            src: urljoin(serverUrl, completePath, '/' + file.path)
          });
        } else {
          next();
        }
        break;
      }
    }
  });
};

// Download the files from the torrent and return the source when 2% of the video has been downloaded
exports.downloadTorrent = async (req, res, next) => {
  const tmpPath = 'assets/videos/tmp';
  const completePath = 'assets/videos/complete';
  const serverUrl = req.protocol + '://' + req.get('host');
  const engine = torrentStream('magnet:?xt=urn:btih:' + req.body.hash, { path: tmpPath });
  let response = {};
  let videoFile;
  let responseIsSent = false;
  
  engine.on('ready', function() {
    for (const file of engine.files) {
      if (
        file.name.substr(file.name.length - 3) === 'mkv' ||
        file.name.substr(file.name.length - 3) === 'mp4'
      ) {
        videoFile = file;
        let startByte = (req.body.targetPercent == null) ? 0 : (Math.floor(req.body.targetPercent) * file.length / 100);
        let endByte = file.length;
        file.createReadStream({ start: startByte, end: endByte });
        response = {
          start: req.body.targetPercent,
          status: 'downloading',
          src: urljoin(serverUrl, tmpPath, '/' + file.path)
        };
        // pushToArray(downloadingVideo, req.body.hash);
      } else {
        file.deselect();
      }
    }
  });

  engine.on('download', () => {
    console.log(req.headers.range);
    console.log(Number.parseFloat((engine.swarm.downloaded / videoFile.length) * 100).toFixed(2) + '% downloaded');

    let div = engine.swarm.downloaded / videoFile.length;
    if (!responseIsSent && div > 0.02) {
      responseIsSent = true;
      return res.status(200).json(response);
    }
  });

  engine.on('idle', async () => {
    console.log('download ended');
    // deleteFromArray();
    const folderName = path.dirname(videoFile.path);
    // Move file to 'complete' folder only if download started at the beggining
    if (response.start == 0) {
      // create folder 'assets/videos/complete/folderName'
      await mkdirp(path.join(completePath, folderName));
      // move file to 'assets/videos/complete/folderName'
      fs.rename(
        path.join(tmpPath, videoFile.path),
        path.join(completePath, videoFile.path),
        () => {
          console.log('Video file moved to ${completePath}');
        });
      // delete the folder still in tmp folder
      rimraf(path.join(tmpPath, folderName), () => {
        console.log('tmp ${folderName} deleted');
      });
    }
    // set new status to response // Probably can delete this
    response.status = 'complete';
    response.src = response.src.replace('/tmp/', '/complete/');
    if (!responseIsSent) {
      return res.status(200).json(response);
    }
  });
}

exports.streamVideo = (req, res, next) => {
  const file = './' + Object.values(req.params).join('/');
  fs.stat(file, (err, stats) => {
    if (err) {
      // file does not exist
      if (err.code === 'ENOENT') {
        return res.sendStatus(404);
      }
      return next(err);
    }
    let range = req.headers.range;
    if (!range) {
      let err = new Error('Wrong range');
      err.status = 416;
      return next(err);
    }
    let positions = range.replace(/bytes=/, '').split('-');
    let start = parseInt(positions[0], 10);
    let fileSize = stats.size;
    let end = positions[1] ? parseInt(positions[1], 10) : fileSize - 1;
    // Amount of bits that will be sent back to browser
    let chunkSize = (end - start) + 1;
    // Header for the video tag
    let head = {
      'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunkSize,
			'Content-Type': 'video/mp4'
    }
    // Send the custom header
    res.writeHead(206, head);
    let streamPositions = {
      start: start,
      end: end
    };
    let stream = fs.createReadStream(file, streamPositions);
    stream.on('open', () => {
      stream.pipe(res);
    });
    stream.on('error', err => {
      return next(err);
    });
  });
  // res.status(200).send('ok');
}

// exports.checkComplete = (req, res) => {
//   setInterval(() => {
//     if (!downloadingVideo.includes(req.hash))
//       return res.status(200).send('complete');
//   }, 1000);
// };
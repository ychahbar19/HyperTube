/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const VideoModel = require('../models/VideoModel');
const tmpPath = 'assets/videos/tmp';
const completePath = 'assets/videos/complete';

const axios = require('axios');
const torrentStream = require('torrent-stream');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const urljoin = require('url-join');
const rimraf = require('rimraf');

let videoInfo = {};
// let downloadingVideo = [];

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

// Lists all files in the given dirPath (including its subdirectories)
// and adds them to the given arrayOfFiles.
const getAllFiles = (dirPath, arrayOfFiles) =>
{
  console.log('FCT: getAllFiles');

  arrayOfFiles = arrayOfFiles || [];
  files = fs.readdirSync(dirPath);
  for (const file of files)
  {
    if (fs.statSync(dirPath + '/' + file).isDirectory())
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    else
      arrayOfFiles.push(path.join(file));
  }

  console.log(arrayOfFiles);

  return arrayOfFiles;
};

// const pushToArray = (array, value) => {
//   if (!array.includes(value)) array.push(value);
// };

// Deletes from the given array, the given value.
const deleteFromArray = (array, value) =>
{
  console.log('FCT: deleteFromArray');

  for (let i = 0; i < array.length; i++)
  {
    if (array[i] === value)
    {
      array.splice(i, 1);
      break;
    }
  }
};

/* -------------------------------------------------------------------------- *\
    3) Public functions and exports.
\* -------------------------------------------------------------------------- */

// Fetches the video info from the different sources
// and returns their combined results.
exports.getVideoInfo = async function getVideoInfo(req, res)
{
  await getInfo(req.params.imdb_id);
  if (req.params.yts_id)
    await getTorrents(req.params.yts_id);
  res.status(200).send(videoInfo);
};

// Checks if the video is already downloaded on the server.
// If so, returns a json object with the video's source url.
// If not, goes to next() which is downloadTorrent.
exports.checkDownloadedVids = (req, res, next) =>
{
  console.log('FCT: checkDownloadedVids');

  // ??
  if (req.body.targetPercent !== null)
    return next();

  const engine = torrentStream('magnet:?xt=urn:btih:' + req.body.hash);
  engine.on('ready', () =>
  {
    console.log('engine > ready');

    for (const file of engine.files)
    {
      file.deselect();
      if (file.name.substr(file.name.length - 3) === 'mkv' ||
          file.name.substr(file.name.length - 3) === 'mp4')
      {
        if (fs.existsSync(path.join(completePath, path.dirname(file.path))))
        {
          const serverUrl = req.protocol + '://' + req.get('host');
          const videoSrcUrl = urljoin(serverUrl, completePath, '/' + file.path);

          console.log(videoSrcUrl);

          return res.status(200).json({ start: 0, status: 'complete', src: videoSrcUrl });
        }
        else
          return next();
      }
    }
  });
};

// Downloads the files from the torrent.
// Returns the source when 1% of the video has been downloaded.
exports.downloadTorrent = async (req, res) =>
{
  console.log('FCT: downloadTorrent');

  let response = {};
  let videoFile;
  let responseIsSent = false;
  
  const engine = torrentStream('magnet:?xt=urn:btih:' + req.body.hash, { path: tmpPath });

  // (1/3) When engine is ready, initiates the download stream and defines the response to send.
  engine.on('ready', () =>
  {
    console.log('engine > ready');

    for (const file of engine.files)
    {
      if (file.name.substr(file.name.length - 3) === 'mkv' ||
          file.name.substr(file.name.length - 3) === 'mp4')
      {
        videoFile = file;

        file.createReadStream({
          // Reads from the start or, if given, from the targetPercent.
          start: (req.body.targetPercent == null) ? 0 : (Math.floor(req.body.targetPercent) * file.length / 100),
          // Reads until the end of the file.
          end: file.length
        });

        const serverUrl = req.protocol + '://' + req.get('host');
        const videoSrcUrl = urljoin(serverUrl, tmpPath, '/' + file.path);
        response = { start: req.body.targetPercent, status: 'downloading', src: videoSrcUrl };
        // pushToArray(downloadingVideo, req.body.hash);
      }
      else
        file.deselect();
    }
  });

  // (2/3) Everytime a piece of the video file has been downloaded and verified,
  // checks if we reached 1% downloaded. If so, sends the response.
  engine.on('download', () =>
  {
    console.log('engine > download');
    console.log(Number.parseFloat((engine.swarm.downloaded / videoFile.length) * 100).toFixed(2) + '% downloaded');
    
    if (!responseIsSent &&
        engine.swarm.downloaded / videoFile.length > 0.01)
    {
      responseIsSent = true;
      return res.status(200).json(response);
    }
  });

  // (3/3) When the video is completely downloaded,
  // moves it to the 'complete' folder and deletes what's left in 'tmp'.
  engine.on('idle', async () =>
  {
    console.log('engine > idle');
   
    // ??
    deleteFromArray();
    const folderName = path.dirname(videoFile.path);
    // Move file to 'complete' folder only if download started at the beggining
    if (response.start == 0)
    {
      // Creates folder 'assets/videos/complete/folderName'.
      await mkdirp(path.join(completePath, folderName));
      // Moves the file from 'tmp' to 'complete'.
      fs.rename(
        path.join(tmpPath, videoFile.path),
        path.join(completePath, videoFile.path),
      );
      // Delete the 'tmp' folder and all its contents.
      rimraf(path.join(tmpPath, folderName));
    }
    // set new status to response // Probably can delete this
    // response.status = 'complete';
    // if (!responseIsSent) {
    //   return res.status(200).json(response);
    // }
  });
}

// exports.checkComplete = (req, res) => {
//   setInterval(() => {
//     if (!downloadingVideo.includes(req.hash))
//       return res.status(200).send('complete');
//   }, 1000);
// };
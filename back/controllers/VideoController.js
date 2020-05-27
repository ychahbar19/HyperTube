/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const VideoModel = require('../models/VideoModel');

const axios = require('axios');
const torrentStream = require('torrent-stream');
const fs = require('fs');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf'); // keep to delete tmp video file

let videoInfo = {};

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

const streamVideo = (res, datas) => {

  const file = datas.file;
  const fileSize = datas.length;
  const start = datas.start;
  const end = datas.end;

  //
  //	8.	Calculate the amount of bits will be sent back to the
  //		browser.
  //
  const chunksize = (end - start) + 1;

  //
  //	9.	Create the header for the video tag so it knows what is
  //		receiving.
  //
  const head = {
    'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunksize,
    'Content-Type': 'video/mp4',
    'Connection': 'keep-alive'
  }

  //
  //	10.	Send the custom header
  //
  res.writeHead(206, head);

  //
  //	11.	Create the createReadStream option object so createReadStream
  //		knows how much data it should be read from the file.
  //
  let streamPosition = {
    start: start,
    end: end
  };

  //
  //	12.	Create a stream chunk based on what the browser asked us for
  //
  let stream = file.createReadStream(streamPosition);

  //
  //	13.	Once the stream is open, we pipe the data through the response
  //		object.
  //
  stream.pipe(res);

  //
  //	->	If there was an error while opening a stream we stop the
  //		request and display it.
  //
  stream.on('error', function(err) {
    return next(err);
  });
}

const downloadTorrent = (res, req, positions, directoryPath, filePath) => {
  const engine = torrentStream('magnet:?xt=urn:btih:' + req.params.hash, { path: './assets/videos/tmp' });

  engine.on('ready', () => {
    engine.files.forEach(file => {
      // check de la taille du fichier en serveur avec la taille du fichier 'file'
      // telecharger les parties demandees par le browser
      let ext = file.name.split('.').pop();
      if (ext === 'mkv' || ext === 'mp4' || ext === 'ogg' || ext === 'webm') {
        filePath += ('.' + ext);
        // commencer telechargement de start a end;
        let start = parseInt(positions[0], 10);
        let end = positions[1] ? parseInt(positions[1], 10) : (file.length - 1);
        fs.access(directoryPath, async err => {
          if (err && err.code === 'ENOENT') {
            await mkdirp(directoryPath);
          }
          let src = file.createReadStream();
          let dest = fs.createWriteStream(filePath);
          src.pipe(dest);
          const datas = {
            file: file,
            length: file.length,
            start: start,
            end: end
          }
          streamVideo(res, datas);
        });

      } else {

      }
    });
  });

  engine.on('download', () => {});

  engine.on('idle', () => {});
};

exports.streamManager = (req, res, next) => {
  //
	//	1.	Path to the movie to stream
  //
  let movieDirectoryPath =
    './assets/videos/' + 
    req.params.title + ' ' +
    req.params.quality + ' ' +
    req.params.type;
  let filePath =
    movieDirectoryPath + '/' +
    req.params.title + '.' +
    req.params.quality + '.' +
    req.params.type;

  //
  //	1.	Save the range the browser is asking for in a clear and
  //		reusable variable
  //
  //		The range tells us what part of the file the browser wants
  //		in bytes.
  //
  //		EXAMPLE: bytes=65534-33357823
  //
  let range = req.headers.range;
  //
  //	2.	Make sure the browser ask for a range to be sent.
  //
  if (!range) {
    //
    // 	1.	Create the error
    //
    let err = new Error('Wrong range');
    err.status = 416;

    //
    //	->	Send the error and stop the request.
    //
    return next(err);
  }

  //
  //	3.	Convert the string range in to an array for easy use.
  //
  let positions = range.replace(/bytes=/, '').split('-');

  downloadTorrent(res, req, positions, movieDirectoryPath, filePath);
};
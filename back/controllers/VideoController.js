/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const VideoModel = require('../models/VideoModel');

const axios = require('axios');
const torrentStream = require('torrent-stream');
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

  //	1.	Calculate the amount of bits will be sent back to the
  //		browser.
  const chunksize = (end - start) + 1;

  //	2.	Create the header for the video tag so it knows what is
  //		receiving.
  const head = {
    'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunksize,
    'Content-Type': 'video/mp4',
    'Connection': 'keep-alive'
  }

  //	3.	Send the custom header
  res.writeHead(206, head);

  //	4.	Create the createReadStream option object so createReadStream
  //		knows how much data it should be read from the file.
  let streamPosition = {
    start: start,
    end: end
  };

  //	5.	Create a stream chunk based on what the browser asked us for
  let stream = file.createReadStream(streamPosition);

  //	6.	Once the stream is open, we pipe the data through the response
  //		object.
  stream.pipe(res);

  //	->	If there was an error while opening a stream we stop the
  //		request and display it.
  stream.on('error', function(err) {
    return next(err);
  });
}

//  Download parts asked by the browser
const downloadTorrent = (res, req, positions) => {
  const engine = torrentStream('magnet:?xt=urn:btih:' + req.params.hash, { path: './assets/videos' });

  engine.on('ready', () => {
    engine.files.forEach(file => {
      //  Check if ext is a video file -> If yes, download
      let ext = file.name.split('.').pop();
      if (ext === 'mkv' || ext === 'mp4' || ext === 'ogg' || ext === 'webm') {
        let start = parseInt(positions[0], 10);
        let end = positions[1] ? parseInt(positions[1], 10) : (file.length - 1);
        length = file.length;
        //  start download
        file.createReadStream();
        const datas = {
          file: file,
          length: file.length,
          start: start,
          end: end
        }
        streamVideo(res, datas);
      }
    });
  });
};

exports.streamManager = (req, res, next) => {
  //	1.	Save the range the browser is asking for in a variable
  //		It is a range of bytes asked by the browser
  //		EXAMPLE: bytes=65534-33357823

  //	2.	Make sure the browser ask for a range to be sent.
  let range = req.headers.range;
  if (!range) {
    // 	1.	Create the error
    let err = new Error('Wrong range');
    err.status = 416;

    //	->	Send the error and stop the request.
    return next(err);
  }

  //	3.	Convert from string to array.
  let positions = range.replace(/bytes=/, '').split('-');

  //  4.  Download torrent
  downloadTorrent(res, req, positions);
};
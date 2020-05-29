/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const VideoModel = require('../models/VideoModel');
const MovieHistoryModel = require('../models/MovieHistoryModel');

const axios = require('axios');
const torrentStream = require('torrent-stream');
const fs = require('fs');
const rimraf = require('rimraf'); // keep to delete tmp video file
const path = require('path');

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

const removeDir = (path) => {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path);

    if (files.length > 0) {
      files.forEach(function (filename) {
        if (fs.statSync(path + "/" + filename).isDirectory()) {
          removeDir(path + "/" + filename);
        } else {
          fs.unlinkSync(path + "/" + filename);
        }
      });
      fs.rmdirSync(path);
    } else {
      fs.rmdirSync(path);
    }
  } else {
    console.log("Directory path not found.");
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

//  Update lastSeen (milliseconds) in DB or add it if it's not in it yet
const updateDB = async (req, next) => {
    try {
      const lastSeen = await MovieHistoryModel.findOne({ id: req.params.id });
      const now = Date.now();
      console.log(now);
      if (lastSeen) {
        MovieHistoryModel.updateOne({ id: req.params.id }, { $set: { lastSeen: now } });
      } else {
        const movieHistory = new MovieHistoryModel({
          id: req.params.id,
          lastSeen: now
        });
        movieHistory.save();
      }
    } catch (err) {
      return next(err);
    }
}

const streamVideo = (res, datas, completeVideo) => {

  const file = datas.file;
  const fileSize = datas.length;
  const start = datas.start;
  const end = datas.end;

  console.log(file);

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
  let stream;
  if (!completeVideo) {
    stream = file.createReadStream(streamPosition);
  } else {
    stream = fs.createReadStream(file, streamPosition);
  }
  //	6.	Once the stream is open, we pipe the data through the response
  //		object.
  stream.pipe(res);

  //	->	If there was an error while opening a stream we stop the
  //		request and display it.
  stream.on('error', function(err) {
    console.log(err);
    return next(err);
  });
}

//  Download parts asked by the browser
const downloadTorrent = (req, res, datas, paths) => {
  //  check if paths.uncomplete existe -> if it is complete : rename.
  //  else : start downloading the file
  if (fs.existsSync(paths.uncomplete)) {
    // Compare the uncomplete file size with the torrent-stream file size
    const sizeUncomplete = fs.statSync(paths.uncomplete).size;
    const sizeTorrentStream = datas.file.length;

    if (sizeUncomplete === sizeTorrentStream) {
      console.log('same sizes -> rename and delete');
      //  Move from uncomplete to complete
      fs.rename(paths.uncomplete, paths.complete, err => {
        if (err)
          console.log(err); // a gerer mieux
        else {
          console.log('moved from ' + paths.uncomplete + ' to ' + paths.complete);
          datas.file = paths.complete;
          //  Delete the engine folder
          removeDir('./assets/videos/' + req.params.hash);
          // rimraf('./assets/videos/' + req.params.hash + '/', err => {
          //   if (err)
          //     console.log(err) // a gerer mieux
          //   else
          //     console.log('deleted ./assets/videos/' + req.params.hash);
          // });
          streamVideo(res, datas, true);
        }
      });
    } else {
      //  start download
      let src = datas.file.createReadStream();
      src.pipe(fs.createWriteStream(paths.uncomplete));
      streamVideo(res, datas, false);
    }
  } else {
    //  start download
    let src = datas.file.createReadStream();
    src.pipe(fs.createWriteStream(paths.uncomplete));
    streamVideo(res, datas, false);
  }
};


//  Download parts asked by the browser
const startEngine = (req, res, next, positions, paths) => {
  const engine = torrentStream('magnet:?xt=urn:btih:' + req.params.hash, { path: './assets/videos/' + req.params.hash });
  
  engine.on('ready', () => {
    engine.files.forEach(async file => {  
      let ext = file.name.split('.').pop();
      //  Check if ext is a video file
      if (ext === 'mkv' || ext === 'mp4' || ext === 'ogg' || ext === 'webm') {
        paths.uncomplete += ('.' + ext);
        paths.complete += ('.' + ext);
        // Create object with datas needed to stream the movie
        const start = parseInt(positions[0], 10);
        const end = positions[1] ? parseInt(positions[1], 10) : file.length - 1;
        const datas = {
          length: file.length,
          start: start,
          end: end
        };
        // check if paths.complete existe -> we know the movie is fully downloaded already -> stream the movie
        // else : start / continue downloading the file before streaming it
        if(fs.existsSync(paths.complete)) {
          datas.file = paths.complete;
          streamVideo(res, datas, true);
        } else {
          datas.file = file;
          downloadTorrent(req, res, datas, paths);
        }
      }
    });
  });

  engine.on('idle', () => {
    console.log('ended');
  });
};

exports.streamManager = (req, res, next) => {
  //	1. Create 2 paths.
  const paths = {
    uncomplete: './assets/videos/downloading/' + req.params.hash,
    complete: './assets/videos/downloaded/' + req.params.hash
  }

  //	2.	Save the range the browser is asking for in a variable
  //		It is a range of bytes asked by the browser
  //		EXAMPLE: bytes=65534-33357823
  let range = req.headers.range;

  //	3.	Make sure the browser ask for a range to be sent.
  if (!range) {
    // 	1.	Create the error
    let err = new Error('Wrong range');
    err.status = 416;

    //	->	Send the error and stop the request.
    return next(err);
  }

  //	4.	Convert from string to array.
  let positions = range.replace(/bytes=/, '').split('-');

  //  5.  Download torrent
  startEngine(req, res, next, positions, paths);
};
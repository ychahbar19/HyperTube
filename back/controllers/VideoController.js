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
const pump = require('pump');

let videoInfo = {};
let movies = {};

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
// exports.downloadTorrent = async (req, res, next) => {
//   const tmpPath = 'assets/videos/tmp';
//   const completePath = 'assets/videos/complete';
//   const serverUrl = req.protocol + '://' + req.get('host');
//   const engine = torrentStream('magnet:?xt=urn:btih:' + req.body.hash, { path: tmpPath });
//   let response = {};
//   let videoFile;
//   let responseIsSent = false;

//   engine.on('ready', function() {
//     for (const file of engine.files) {
//       if (
//         file.name.substr(file.name.length - 3) === 'mkv' ||
//         file.name.substr(file.name.length - 3) === 'mp4'
//       ) {
//         videoFile = file;
//         let startByte = (req.body.targetPercent == null) ? 0 : (Math.floor(req.body.targetPercent) * file.length / 100);
//         let endByte = file.length;
//         file.createReadStream({ start: startByte, end: endByte });
//         response = {
//           start: req.body.targetPercent,
//           status: 'downloading',
//           src: urljoin(serverUrl, tmpPath, '/' + file.path)
//         };
//         // pushToArray(downloadingVideo, req.body.hash);
//       } else {
//         file.deselect();
//       }
//     }
//   });

//   engine.on('download', () => {
//     console.log(Number.parseFloat((engine.swarm.downloaded / videoFile.length) * 100).toFixed(2) + '% downloaded');

//     let div = engine.swarm.downloaded / videoFile.length;
//     if (!responseIsSent && div > 0.02) {
//       responseIsSent = true;
//       return res.status(200).json(response);
//     }
//   });

//   engine.on('idle', async () => {
//     console.log('download ended');
//     // deleteFromArray();
//     const folderName = path.dirname(videoFile.path);
//     // Move file to 'complete' folder only if download started at the beggining
//     if (response.start == 0) {
//       // create folder 'assets/videos/complete/folderName'
//       await mkdirp(path.join(completePath, folderName));
//       // move file to 'assets/videos/complete/folderName'
//       fs.rename(
//         path.join(tmpPath, videoFile.path),
//         path.join(completePath, videoFile.path),
//         () => {
//           console.log('Video file moved to ${completePath}');
//         });
//       // delete the folder still in tmp folder
//       rimraf(path.join(tmpPath, folderName), () => {
//         console.log('tmp ${folderName} deleted');
//       });
//     }
//     // set new status to response // Probably can delete this
//     response.status = 'complete';
//     response.src = response.src.replace('/tmp/', '/complete/');
//     if (!responseIsSent) {
//       return res.status(200).json(response);
//     }
//   });
// }
// let videoFile;




// const downloadTorrent = (req, opts, directoryPath, filePath, isInDb) => {
//   const engine = torrentStream('magnet:?xt=urn:btih:' + req.params.hash, { path: './assets/videos/tmp' });
//   engine.on('ready', async () => {
//     for (const file of engine.files) {
//       let ext = file.name.split('.').pop();
//       if (ext === 'mkv' || ext === 'mp4' || ext === 'ogg' || ext === 'webm') {
//         // videoFile = file; // A décommenter pour le on('download');
//         filePath += ('.' + ext);
//         try {
//           const foundMovie = await DownloadedMovieModel.findOne({
//             movieName: req.params.title,
//             quality: req.params.quality,
//             type: req.params.type,
//           });
//           if (foundMovie) {
//             ext = foundMovie.extension;
//             isInDb = true;
//           } else {
//             const downloadedMovie = new DownloadedMovieModel({
//               movieName: req.params.title,
//               quality: req.params.quality,
//               type: req.params.type,
//               extension: ext,
//               status: 'downloading'
//             });
//             downloadedMovie.save();
//           }
//         } catch (err) {
//           console.log(err); // a gerer mieux
//         }
//         let start;
//         let end;
//         if (opts.full) {
//           start = 0;
//           end = file.length - 1;
//         }
//         // // change start depending on first download - browser's range, .... (end too)
//         // const start = 0;
//         // const end = file.length - 1;
//         fs.access(directoryPath, async err => {
//           if (err && err.code === "ENOENT") {
//             await mkdirp(directoryPath);
//           }
//           let src = file.createReadStream({ start: start, end: (end / 20) });
//           let dest = fs.createWriteStream(filePath);
//           src.pipe(dest);
//         });
//         // // appel d'une fct A
//       }
//     }
//   });
//   // engine.on('download', () => {
//   //   console.log(videoFile.name);
//   //   console.log(
//   //     Number.parseFloat(
//   //       (engine.swarm.downloaded / videoFile.length) * 100
//   //     ).toFixed(2) + '% downloaded'
//   //   );
//   // });
//   engine.on('idle', () => {
//     rimraf('./assets/videos/tmp', () => {
//       // console.log('tmp folder deleted');
//     });
//     // update db -> status: 'fully downloaded';
//     try {
//       // console.log('updating movie status in db !');
//       DownloadedMovieModel.update(
//       { 'movieName': req.params.title, 'quality': req.params.quality, 'type': req.params.type },
//       { $set: { 'status': 'fully downloaded' } }
//     );
//     } catch (err) {
//       console.log(err) // a gerer mieux -> return new Error ?
//     }
//     console.log('download ended!');
//   });
// }

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
  // let stream = fs.createReadStream(file, streamPosition);
  //
  //	13.	Once the stream is open, we pipe the data through the response
  //		object.
  //
  stream.pipe(res);
  // console.log(res);
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
/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const VideoModel = require('../models/VideoModel');
const MovieHistoryModel = require('../models/MovieHistoryModel');
const UserModel = require('../models/UserModel');
// const ObjectId = require('mongodb').ObjectId;

const path = require('path');
const fs = require('fs');

const http = require('http');
const axios = require('axios');
const rarbgApi = require('rarbg-api')
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const torrentStream = require('torrent-stream');

// OpenSubtitles
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS('ychahbar');
const zlib = require('zlib');
const iconv = require('iconv-lite');
const srt2vtt = require('srt-to-vtt');
var stringSimilarity = require('string-similarity');

//ObjectId
const ObjectId = require('mongodb').ObjectId;


let videoInfo = {};

/* -------------------------------------------------------------------------- *\
    2) Private functions.
\* -------------------------------------------------------------------------- */

// Gets the video's info from The Open Movie Database (OMDb) and The Movie Database (TMBD).
async function getInfo(user_language, imdb_id)
{
  await axios.get('http://www.omdbapi.com/?apikey=82d3568e&i=' + imdb_id)
    .then(async results =>
    {
      videoInfo = new VideoModel(results.data);
      videoInfo['Director'] = videoInfo['Director'].replace(/ *\([^)]*\) */g, "");
      videoInfo['Writer'] = videoInfo['Writer'].replace(/ *\([^)]*\) */g, "");
      if (videoInfo['Poster'] == 'N/A')
        videoInfo['Poster'] = '../../assets/img/__default_poster.png';
      if (user_language == 'fr')
      {
        await axios.get('https://api.themoviedb.org/3/find/' + imdb_id + '?external_source=imdb_id&language=fr-FR&api_key=d3cba2eda31968ee058ffc7166dbfad9')
        .then(results =>
          {
            videoInfo['title'] = results.data.movie_results[0]['title'];
            videoInfo['overview'] = results.data.movie_results[0]['overview'];
          })
          .catch(error => error)
      }
    })
    .catch(error => error);
};

// Gets the video's torrents from YTS' API.
async function getYtsTorrents(yts_id)
{
  await axios.get('https://yts.mx/api/v2/movie_details.json?movie_id=' + yts_id)
    .then(results =>
    {
      videoInfo.Torrents = results.data.data.movie.torrents;      
      Object.entries(videoInfo.Torrents).forEach(item =>
      {
        item[1].title = 'YIFY ' + item[1].quality + ' ' + item[1].type;
        let date = new Date(item[1].date_uploaded_unix * 1000);
        item[1].year_uploaded = date.getFullYear();
      });
    })
    .catch(error => console.log('error: ', error)); // si erreur : res is not defined. Devrait return error pour que getVideoInfo send status 400
};

// Gets the video's torrents from rargb' API.
async function getRargbTorrents(imdb_id)
{
  await rarbgApi.search(imdb_id, null, 'imdb')
    .then(results =>
    {
      results.forEach(result =>
      {
        let magnet = decodeURIComponent(result.download);
        magnet = magnet.replace('magnet:?xt=urn:btih:', '');
        hash = magnet.split("&")[0].toUpperCase();
        videoInfo.Torrents = {
          hash: hash,
          peers: result.leechers,
          seeds: result.seeders,
          size: (Math.round(result.size / 10000000) / 100).toString() + ' GB',
          size_bytes: result.size,
          date_uploaded: result.pubdate,
          year_uploaded: result.pubdate.substring(0, 4),
          title: result.title
        };
      });
    })
    .catch(error => console.log('error: ', error));
};

/* -------------------------------------------------------------------------- *\
    3) Public functions and exports.
\* -------------------------------------------------------------------------- */

// Fetches the video info from the different sources
// and returns their combined results.
exports.getVideoInfo = async function getVideoInfo(req, res)
{
  await getInfo(req.params.user_language, req.params.imdb_id);
  if (req.params.yts_id != undefined)
  {
    if (req.params.yts_id != 0)
      await getYtsTorrents(req.params.yts_id);
    else
      await getRargbTorrents(req.params.imdb_id);
  }
  res.status(200).send(videoInfo);
};

//  Update lastSeen (milliseconds) in DB or add it if it's not in it yet
const updateDB = async (req, next, ext) => {
    try {
      const lastSeen = await MovieHistoryModel.findOne({ hash: req.params.hash });
      const now = Date.now();
      if (lastSeen) {
        await MovieHistoryModel.updateOne({ hash: req.params.hash }, { $set: { lastSeen: now } });
      } else {
        const movieHistory = new MovieHistoryModel({
          hash: req.params.hash,
          lastSeen: now,
          extension: ext
        });
        movieHistory.save();
      }
    } catch (error) {
      console.log('Could not update `lastSeen` in database...');
      console.log(error);
    }
}

const streamVideo = (res, datas, completeVideo) => {

  const ext = datas.extension;
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
    'Content-Type': 'video/' + ext,
    'Connection': 'keep-alive'
  };

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

const startDownload = (res, datas, paths) => {
  let src = datas.file.createReadStream();
  src.pipe(fs.createWriteStream(paths.uncomplete));
  streamVideo(res, datas, false);
}

//  Download parts asked by the browser
const downloadTorrent = (req, res, datas, paths) => {
  //  1. Check if paths.uncomplete existe.
  //      else : start downloading the file.
  if (fs.existsSync(paths.uncomplete)) {
    //  1. Compare the uncomplete file size with the torrent-stream file size
    const sizeUncomplete = fs.statSync(paths.uncomplete).size;
    const sizeTorrentStream = datas.file.length;

    if (sizeUncomplete === sizeTorrentStream) {
      //  Move from uncomplete to complete
      fs.rename(paths.uncomplete, paths.complete, err => {
        if (err)
          console.log(err); // a gerer mieux
        else {
          datas.file = paths.complete;
          //  Delete the engine folder
          rimraf('./assets/videos/' + req.params.hash + '/', err => {
            if (err)
              console.log(err) // a gerer mieux
          });
          streamVideo(res, datas, true);
        }
      });
    } else {
      startDownload(res, datas, paths);
    }
  } else {
    startDownload(res, datas, paths);
  }
};

const subFilter = async (subArray, fileName) => {
  const language = ['English', 'French'];
  let result = [];

  let name = fileName.substr(0, fileName.lastIndexOf('.'));
  for (let index = 0; language[index]; index++)
  {
    target = [];
    targetStrings = [];
    for(let i = 0; subArray[i]; i++)
    {
      for (let j = 0; subArray[i][j]; j++)
      { 
        if (subArray[i][j].LanguageName === language[index])
        { 
          targetStrings.push(subArray[i][j].MovieReleaseName);
          target.push(subArray[i][j]);
        }
      }
    }
    Matches = stringSimilarity.findBestMatch(name, targetStrings);
    result.push(target[Matches.bestMatchIndex]);
  }
  return result;
};

const downloadSubtitles = async (subArray, hash) => {
  iconv.decodeStream('iso-8859-5');

  for (let i = 0; subArray[i]; i++)
  {
    const path = './assets/subtitles/' + hash;
    let language;

    if ( subArray[i].LanguageName === 'French')
      language = 'fr';
    else
      language = 'en';
    
    if (!fs.existsSync(path))
      fs.mkdirSync(path);
    const output = fs.createWriteStream('./assets/subtitles/' + hash + '/' + hash +  '.' + language +'.vtt');
    http.get(subArray[i].SubDownloadLink, (response) => {
      response
      .pipe(zlib.createGunzip())
      .pipe(srt2vtt())
      .pipe(output);
    });
  }
};

const SubtitlesManager = async (hash, imdbId, fileName) => {
  if (!fs.existsSync('./assets/subtitles/' + hash + '/'))
  {
    // 1. Connect to the Subtitle API and generate the access token
    const SubLogin =  await OpenSubtitles.api.LogIn('ychahbar', 'qwerty1994*', 'en', 'ychahbar');
    // 2. Search for Subtitles with the right IMDB ID
    const subObject =  await OpenSubtitles.api.SearchSubtitles(SubLogin.token, [{ imdbid :  imdbId.replace('tt', '')}]);
    // 3. Transform our big object with all the results to an array of array
    let subArray = Object.values(subObject);
    for (let i = 0; subArray[i]; i++)
      subArray[i] = Object.values(subArray[i]);
    // 4. Match the right Subtitles results (quality, encoding type, ..)
    subArray = await subFilter(subArray, fileName);
    // 5. Download the right Subtitles
    await downloadSubtitles(subArray, hash);
  }
};

//  Download parts asked by the browser
const startEngine = (req, res, next, positions, paths) =>
{
  const engine = torrentStream('magnet:?xt=urn:btih:' + req.params.hash, { path: './assets/videos/' + req.params.hash, dht: true });
  engine.on('ready', () =>
  {
    engine.files.forEach(async file =>
    {  
      let ext = file.name.split('.').pop();
      //  1. Check if ext is a video file.
      if (ext === 'mkv' || ext === 'mp4' || ext === 'ogg' || ext === 'webm') {
        paths.uncomplete += ('.' + ext);
        paths.complete += ('.' + ext);
        // manage the Subtitles from Opensubtitles's API
        await SubtitlesManager(req.params.hash, req.params.imdbId, file.name);
        //  1. Create object with datas needed to stream the movie.
        const start = parseInt(positions[0], 10);
        const end = positions[1] ? parseInt(positions[1], 10) : file.length - 1;
        const datas = {
          extension: ext,
          length: file.length,
          start: start,
          end: end
        };
        //  2. Check if paths.complete exists.
        //      else : start / continue downloading the file before streaming it.
        if(fs.existsSync(paths.complete)) {
          //  1. update DB
          updateDB(req, next, ext);
          //  2. Movie entirely downloaded -> stream
          datas.file = paths.complete;
          streamVideo(res, datas, true);
        } else {
          datas.file = file;
          downloadTorrent(req, res, datas, paths);
        }
      }
    });
  });
};

exports.streamManager = async (req, res, next) => {
  //	1. Create 2 paths.
  const paths = {
    uncomplete: './assets/videos/downloading/' + req.params.hash,
    complete: './assets/videos/downloaded/' + req.params.hash
  }

  //	2. Create both folders
  await mkdirp(path.dirname(paths.uncomplete));
  await mkdirp(path.dirname(paths.complete));

  //	3.	Save the range the browser is asking for in a variable
  //		It is a range of bytes asked by the browser
  //		EXAMPLE: bytes=65534-33357823
  let range = req.headers.range;

  //	4.	Make sure the browser ask for a range to be sent.
  if (!range) {
    // 	1.	Create the error
    let err = new Error('Wrong range');
    err.status = 416;

    //	->	Send the error and stop the request.
    return next(err);
  }

  //	5.	Convert from string to array.
  let positions = range.replace(/bytes=/, '').split('-');

  //  6.  Download torrent
  startEngine(req, res, next, positions, paths);
};

exports.streamSubtitles = (req, res, next) => {
  const hash = req.params.hash;
  const language = req.params.lang;
  const path = './assets/subtitles/' + hash + '/' + hash + '.' + language + '.vtt';

  //	3.	Send the custom header
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('content-type', 'text/vtt');

  if (fs.existsSync(path)) {
    fs.createReadStream(path)
      .pipe(res);
  }
};

exports.setSeenMovie = async (req, res, next) => {
  try {
    const imdbId = req.params.imdbId;

    // find the current user
    const oUserId = ObjectId(req.userToken.userId);
    const user = await UserModel.findOne({ _id: oUserId });

    // security check
    if (!user)
      return res.status(401).json({ message: 'Oops, user not found !' });
    // update the movieHistory array if imdbId is not includes
    if (user.movieHistory.includes(imdbId) === false)
      await UserModel.updateOne({ _id: oUserId }, { $push: { movieHistory:  imdbId} });
  } catch (e) {
    console.log('Could not set the movie as seen in the DB !');
    console.log(e); // a gerer mieux
  }
};

exports.isSeen = async (req, res, next) => {
  try {
    const imdbId = req.params.movie;
    const oUserId = ObjectId(req.userToken.userId);
    const user = await UserModel.findOne({ _id: oUserId , movieHistory: { $all: [imdbId] }});
    if (user !== null)
      status = true;
    else
      status = false;
    return res.status(200).send(status);
  } catch (e) {
    console.log('Could not see if movie is seen');
    console.log(e); // a gerer mieux
  }
};
const axios = require('axios');

const VideoModel = require('../models/VideoModel');
let videoInfo = {};

function getInfo()
{
  axios.get('http://www.omdbapi.com/?apikey=82d3568e&i=tt0077869')
    .then(results =>
    {
      videoInfo = new VideoModel(results.data);
    })
    .catch(error => res.status(400).json({ error }));
};

function getTorrents()
{
  axios.get('https://yts.mx/api/v2/movie_details.json?movie_id=4956')
    .then(results =>
    {
      videoInfo.Torrents = results.data.data.movie.torrents;
    })
    .catch(error => res.status(400).json({ error }));
};

async function getVideoInfo(req, res)
{
  await getInfo();
  await getTorrents();
  res.status(200).send(videoInfo);
};

module.exports.getVideoInfo = getVideoInfo;

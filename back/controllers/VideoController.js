const axios = require('axios');

const VideoModel = require('../models/VideoModel');
let videoInfo = {};

function getInfo()
{
  axios.get('http://www.omdbapi.com/?apikey=82d3568e&i=tt3896198')
    .then(results =>
    {
      videoInfo = new VideoModel(results.data);
    })
    .catch(error => res.status(400).json({ error }));
};

function getTorrents()
{
};

async function getVideoInfo(req, res)
{
  await getInfo();
  res.status(200).send(videoInfo);
};

module.exports.getVideoInfo = getVideoInfo;

const axios = require('axios');

const VideoModel = require('../models/VideoModel');

exports.getVideoInfo = (req, res) =>
{
  axios.get('http://www.omdbapi.com/?apikey=82d3568e&i=tt3896198')
    .then(results =>
    {
      const videoInfo = new VideoModel(results.data);
      res.status(200).send(videoInfo);
    })
    .catch(error => res.status(400).json({ error }));
};

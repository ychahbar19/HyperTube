const https = require('https');

const MovieModel = require('../models/MovieModel');
const TVShowModel = require('../models/TVShowModel');



exports.searchMovies = (req, res, next) =>
{

  //https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
  
  MovieModel.find()
    .then(movies => res.status(200).json(movies))
    .catch(error => res.status(400).json({ error }));
};

exports.searchTVShows = (req, res, next) =>
{
  TVShowModel.find()
    .then(tvshows => res.status(200).json(tvshows))
    .catch(error => res.status(400).json({ error }));
};

exports.searchAll = (req, res, next) =>
{
  res.send('Bad request to /api/search (all)');
};

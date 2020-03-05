const axios = require('axios');

const YtsResultsModel = require('../models/YtsResultsModel');
const ResultModel = require('../models/ResultModel');
let hypertubeResults = {};

/*
let hypertubeResults = [ResultModel];
let hypertubeResultsIndex = 0;

function addToHypertubeResults(imdb_id, title)
{
  hypertubeResults[hypertubeResultsIndex] =
  {
    imdb_id: imdb_id,
    title: title
  };
  hypertubeResultsIndex++;
}
*/

exports.searchMovies = (req, res, next) =>
{
  axios.get('https://yts.mx/api/v2/list_movies.json?query_term=lord')
    .then(results =>
    {
      const ytsResults = new YtsResultsModel(results.data);
      //ytsResults.data.movies.forEach(movie => addToHypertubeResults(movie.imdb_code, movie.title));
      ytsResults.data.movies.forEach(movie => { hypertubeResults[movie.imdb_code] = movie.title; });
      res.send(hypertubeResults);
    })
    .catch(error => res.status(400).json({ error }));
};

exports.searchTVShows = (req, res, next) =>
{
  res.send('Bad request to /api/search (tv shows)');
};

exports.searchAll = (req, res, next) =>
{
  res.send('Bad request to /api/search (all)');
};
const axios = require('axios');

const YtsResultsModel = require('../models/YtsResultsModel');
const EztvResultsModel = require('../models/EztvResultsModel');
//const ResultModel = require('../models/ResultModel');
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

//exports.searchMovies = (req, res) =>
function searchMovies()
{
  axios.get('https://yts.mx/api/v2/list_movies.json?query_term=lord')
    .then(results =>
    {
      const ytsResults = new YtsResultsModel(results.data);
      //ytsResults.data.movies.forEach(movie => addToHypertubeResults(movie.imdb_code, movie.title));
      ytsResults.data.movies.forEach(movie => { hypertubeResults[movie.imdb_code] = movie.title; });
      //res.status(200).send(hypertubeResults);
    })
    .catch(error => res.status(400).json({ error }));
};

//exports.searchTVShows = (req, res) =>
function searchTVShows()
{
  axios.get('https://eztv.io/api/get-torrents')
    .then(results =>
    {
      const eztvResults = new EztvResultsModel(results.data);
      eztvResults.torrents.forEach(tvshow => { hypertubeResults['tt'+tvshow.imdb_id] = tvshow.title; });
      //res.status(200).send(hypertubeResults);
    })
    .catch(error => res.status(400).json({ error }));
};

async function search(req, res)
{
  await searchMovies();
  await searchTVShows();
  res.status(200).send(hypertubeResults);
};

module.exports.search = search;

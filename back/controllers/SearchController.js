/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const axios = require('axios');
const YtsResultsModel = require('../models/YtsResultsModel');
const EztvResultsModel = require('../models/EztvResultsModel');
//const ResultModel = require('../models/ResultModel');

let hypertubeResults = {};
//let hypertubeResultsIndex = 0;

/* -------------------------------------------------------------------------- *\
    2) Private functions.
\* -------------------------------------------------------------------------- */

//Fills our hypertubeResults by being called from the different sources.
function addToHypertubeResults(imdb_id, title, yts_id, eztv_id)
{
  hypertubeResults[imdb_id] =
  {
    title: title,
    yts_id: yts_id,
    eztv_id: eztv_id
  };
}

//Fetches results from YTS' API.
async function searchMovies(query_term)
{
  let yts_url = 'https://yts.mx/api/v2/list_movies.json?limit=50';
  if (query_term)
  {
    yts_url = yts_url + '&query_term=' + query_term;
  }
  /*
  genre=
  page=1
  
  sort_by=(rating/peers/seeds/download_count/like_count, title, year)
  order_by=(desc, asc)
*/
  await axios.get(yts_url)
    .then(results =>
    {
      const ytsResults = new YtsResultsModel(results.data);
      hypertubeResults = {};
      ytsResults.data.movies.forEach(movie => addToHypertubeResults(movie.imdb_code, movie.title, movie.id, ''));
    })
    .catch(error => res.status(400).json({ error }));
};

/*
//Fetches results from ETZV' API.
async function searchTVShows()
{
  await axios.get('https://eztv.io/api/get-torrents')
    .then(results =>
    {
      const eztvResults = new EztvResultsModel(results.data);
      eztvResults.torrents.forEach(tvshow => { hypertubeResults['tt'+tvshow.imdb_id] = tvshow.title; });
      //res.status(200).send(hypertubeResults);
    })
    .catch(error => res.status(400).json({ error }));
};
*/

/* -------------------------------------------------------------------------- *\
    3) Public function and export.
\* -------------------------------------------------------------------------- */

//Calls the different sources and returns their combined results.
async function search(req, res)
{
  await searchMovies(req.query.query_term);
  //await searchTVShows();
  res.status(200).send(hypertubeResults);
};

module.exports.search = search;

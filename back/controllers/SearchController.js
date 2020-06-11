/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const axios = require('axios');
const rarbgApi = require('rarbg-api');

const YtsResultsModel = require('../models/YtsResultsModel');

let hypertubeResults = {};

/* -------------------------------------------------------------------------- *\
    2) Private functions.
\* -------------------------------------------------------------------------- */

//Fetches results from YTS' API.
async function searchYTSMovies(query_term, genre, sort_by, page)
{
  let yts_url = 'https://yts.mx/api/v2/list_movies.json?limit=50';
  if (query_term)
  {
    yts_url += '&query_term=' + query_term;
    if (sort_by == '') { sort_by = 'title'; }
  }
  if (genre)                  { yts_url += '&genre=' + genre; }
  if (sort_by == 'title')     { yts_url += '&sort_by=title&order_by=asc'; }
  else if (sort_by == 'year') { yts_url += '&sort_by=year&order_by=desc'; }
  else                        { yts_url += '&sort_by=download_count'; }
  if (page)                   { yts_url += '&page=' + page; }

  await axios.get(yts_url)
    .then(results =>
    {
      const ytsResults = new YtsResultsModel(results.data);
      ytsResults.data.movies.forEach((movie) => { hypertubeResults[movie.imdb_code] = { yts_id: movie.id }; });
    })
    .catch(error => res.status(400).json({ error }));
};

//Fetches results from rarbg' API.
async function searchRarbgMovies(query_term, genre, sort_by, page)
{
  if (query_term != '')
  {
    const options = {
      category: rarbgApi.CATEGORY.MOVIES,
      limit: 25, //25, 50, 100
      sort: 'leechers', //last, seeders, leechers
      format: 'json_extended'
    }

    await rarbgApi.search(query_term, options)
      .then(results =>
      {
        results.forEach((movie) => { hypertubeResults[movie.episode_info.imdb] = { yts_id: 0 }; });
      })
      .catch(error => {console.log('error0'); res.status(400).json({ error })});
  }
}

/* -------------------------------------------------------------------------- *\
    3) Public function and export.
\* -------------------------------------------------------------------------- */

//Calls the different sources and returns their combined results.
async function search(req, res)
{
  hypertubeResults = {}
  let query_term = ((req.query.query_term != undefined) ? req.query.query_term : ''); //String
  let genre = ((req.query.genre != undefined) ? req.query.genre : ''); //String
  let sort_by = ((req.query.sort_by != undefined) ? req.query.sort_by : ''); // 'title' or 'year'
  let page = ((req.query.page != undefined) ? req.query.page : '');

  await searchYTSMovies(query_term, genre, sort_by, page).catch(error => res.status(400).json({ error }));
  await searchRarbgMovies(query_term, genre, sort_by, page).catch(error => res.status(400).json({ error }));

  res.status(200).send(hypertubeResults);
};

module.exports.search = search;

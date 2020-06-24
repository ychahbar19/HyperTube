/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const axios = require('axios');
const rarbgApi = require('rarbg-api');
const YtsResultsModel = require('../models/YtsResultsModel');
const VideoModel = require('../models/VideoModel');

let hypertubeResults = {};

/* -------------------------------------------------------------------------- *\
    2) Private functions.
\* -------------------------------------------------------------------------- */

//Fetches results from YTS' API.
async function searchYTSMovies(query_term, genre, sort_by, page)
{
  let yts_url = 'https://yts.mx/api/v2/list_movies.json?limit=25';
  if (query_term)             { yts_url += '&query_term=' + query_term; }
  if (genre)                  { yts_url += '&genre=' + genre; }
  if (sort_by == 'title')     { yts_url += '&sort_by=title&order_by=asc'; }
  else if (sort_by == 'year') { yts_url += '&sort_by=year&order_by=desc'; }
  else                        { yts_url += '&sort_by=download_count'; }
  if (page)                   { yts_url += '&page=' + page; }

  try
  {
    const results = await axios.get(yts_url);
    const ytsResults = new YtsResultsModel(results.data);
    ytsResults.data.movies.forEach(movie => { hypertubeResults[movie.imdb_code] = { yts_id: movie.id }; });
  }
  catch (error) { throw error; }
};

//Fetches results from rarbg' API.
async function searchRarbgMovies(query_term)
{
  const options = {
    category: rarbgApi.CATEGORY.MOVIES,
    limit: 25,
    sort: 'last',
    format: 'json_extended' }
  try
  {
    const results = await rarbgApi.search(query_term, options);
    results.forEach(movie =>
    {
      if (movie.episode_info != null && !(movie.episode_info.imdb in hypertubeResults))
        hypertubeResults[movie.episode_info.imdb] = { yts_id: 0 };
    });
  }
  catch (error) { throw error; }
}

/* -------------------------------------------------------------------------- *\
    3) Public function and export.
\* -------------------------------------------------------------------------- */

//Calls the different sources and returns their combined results.
async function search(req, res)
{
  hypertubeResults = {}
  let query_term = (req.query.query_term != undefined) ? req.query.query_term : '';
  let genre = (req.query.genre != undefined) ? req.query.genre : '';
  let sort_by = (req.query.sort_by != undefined) ? req.query.sort_by : '';
  let page = (req.query.page != undefined) ? req.query.page : '';
  if (query_term != '' && sort_by == '')
    sort_by = 'title';

  try
  {
    await searchYTSMovies(query_term, genre, sort_by, page);
    if (query_term != '' && page == '' && Object.entries(hypertubeResults).length > 0)
      await searchRarbgMovies(query_term);
  
    hypertubeCompleteResults = [];
    for (const values of Object.entries(hypertubeResults))
    {
      const results = await axios.get('http://www.omdbapi.com/?apikey=82d3568e&i=' + values[0]);
      if (results.data.Response == "True")
      {
        videoInfo = new VideoModel(results.data);
        if (videoInfo['Poster'] == 'N/A')
          videoInfo['Poster'] = '../../assets/img/__default_poster.png';
        hypertubeCompleteResults.push({
          imdb_id: values[0],
          Poster: videoInfo["Poster"],
          Title: videoInfo["Title"],
          Year: videoInfo["Year"],
          imdbRating: videoInfo["imdbRating"],
          imdbVotes: videoInfo["imdbVotes"],
          Genre: videoInfo["Genre"],
          yts_id: values[1].yts_id
        });
      }
    }
  } catch (error) { return res.status(400).json({ error }); }

  // Only keep results that match 'genre'
  if (genre != '')
  hypertubeCompleteResults.forEach((values, key) => {
    if (!(values['Genre'].includes(genre)))
      hypertubeCompleteResults.splice(key, 1);
  });

  // Sort based on 'sort_by'
  if (sort_by == '')
    hypertubeCompleteResults.sort((a, b) => (a.imdbVotes > b.imdbVotes) ? -1 : 1);
  else if (sort_by == 'title')
    hypertubeCompleteResults.sort((a, b) => (a.Title < b.Title) ? -1 : 1);
  else if (sort_by == 'year')
    hypertubeCompleteResults.sort((a, b) => (a.Year > b.Year) ? -1 : 1);

  res.status(200).send(hypertubeCompleteResults);
};

module.exports.search = search;

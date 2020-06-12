import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SearchService {
  private allResults = [];
  private allResultsIndex = 0;

  constructor(private http: HttpClient) {}

  /* --------------------------------------------------------- *\
      Private functions
  \* --------------------------------------------------------- */

  /*
  // Fetches and returns the given film's info from IMDB's API (back).
  private getVideoInfo(user_language, imdb_id)
  {
    return new Promise((resolve, reject) =>
    {
      this.http.get<{}>('http://localhost:3000/api/video/'+ user_language + '/' + imdb_id)
        .toPromise()
        .then(response => { resolve(response); },
              error => { reject(error); });
    });
  }
*/
  // Takes an imdb_id and the contents returned by YTS API to fetch the info from IMDB
  // (using getVideoInfo() above) and combine them with the data from YTS.
  // Adds the complete video card to 'allResults'.
  /*
  private async addToResults(lg, imdb_id, contents, translated_genres)
  {
    const videoInfo = await this.getVideoInfo(lg, imdb_id);

    if (lg == 'fr')
      for (let i = 0; i < translated_genres['en'].length; i++)
        videoInfo['Genre'] = videoInfo['Genre'].replace(translated_genres['en'][i], translated_genres['fr'][i]);

    this.allResults[this.allResultsIndex] = {
      imdb_id,
      Poster: videoInfo['Poster'],
      Title: videoInfo['Title'],
      Year: videoInfo['Year'],
      imdbRating: videoInfo['imdbRating'],
      imdbVotes: videoInfo['imdbVotes'],
      Genre: videoInfo['Genre'],
      yts_id: contents.yts_id
    };
    this.allResultsIndex++;
  }
*/

  /* --------------------------------------------------------- *\
      Public function
  \* --------------------------------------------------------- */

  // Fetches the search results from YTS' API (back), then loops
  // through the object returned with the private function addToResults()
  // to save the results as an array that also includes IMDB info.
  // Returns that array.
  getResults(encodedSearchParams: string, lg, translated_genres)
  {
    this.allResults = [];
    this.allResultsIndex = 0;

    return new Promise((resolve, reject) =>
    {
      this.http.get<{}>('http://localhost:3000/api/search' + encodedSearchParams)
        .toPromise()
        .then(/*async*/ response => {
          /*for (const values of Object.entries(response))
          {
            await this.addToResults(lg, values[0], values[1], translated_genres);
          }
          resolve(this.allResults);
          */

          console.log('response', response)

         resolve(response);
        },
        error => { reject(error); });
    });
  }
}

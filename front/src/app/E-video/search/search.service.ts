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

  // Fetches and returns the given film's info from IMDB's API (back).
  private getVideoInfo(imdb_id) {
    return new Promise((resolve, reject) => {
      this.http.get<{}>('http://localhost:3000/api/video/' + imdb_id)
        .toPromise()
        .then(response => { resolve(response); },
              error => { reject(error); });
    });
  }

  // Takes an imdb_id and the contents returned by YTS API
  // to fetch the info from IMDB (using getVideoInfo() above)
  // and combine them with the data from YTS.
  // Adds the complete video card to 'allResults'.
  private async addToResults(imdb_id, contents) {
    const videoInfo = await this.getVideoInfo(imdb_id);
    this.allResults[this.allResultsIndex] = {
      imdb_id,
      Poster: videoInfo['Poster'],
      Title: videoInfo['Title'],
      Year: videoInfo['Year'],
      imdbRating: videoInfo['imdbRating'],
      imdbVotes: videoInfo['imdbVotes'],
      Genre: videoInfo['Genre'],
      yts_title: contents.title,
      yts_id: contents.yts_id,
      eztv_id: contents.eztv_id
    };
    this.allResultsIndex++;
  }

  /* --------------------------------------------------------- *\
      Public function
  \* --------------------------------------------------------- */

  // Fetches the search results from YTS' API (back), then loops
  // through the object returned with the private function addToResults()
  // to save the results as an array that also includes IMDB info.
  // Returns that array.
  getResults(encodedSearchParams: string) {
    this.allResults = [];
    this.allResultsIndex = 0;
    // ---> dont reset results if calling page 2+ (for infinite loading to push more results)

    return new Promise((resolve, reject) => {
      this.http.get<{}>('http://localhost:3000/api/search' + encodedSearchParams)
        .toPromise()
        .then(async response => {
          for (const values of Object.entries(response)) {
            console.log(values[1]);
            await this.addToResults(values[0], values[1]);
          }
          // } else {
            // Object.entries(response).forEach(values => { this.addToResults(values[0], values[1]); });
          // }
          resolve(this.allResults);
        },
        error => { reject(error); });
    });
  }
}

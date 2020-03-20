import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { Observable, Subject } from 'rxjs';

@Injectable()
export class SearchService
{
  private allResults = [];
  private allResultsIndex = 0;

  constructor(private http: HttpClient) {}

  getVideoInfo(imdb_id)
  {
    return new Promise((resolve, reject) =>
    {
      this.http.get<{}>('http://localhost:3000/api/video/'+imdb_id)
        .toPromise()
        .then(response => { resolve(response); },
              error => { reject(error); });
    });
  }

  async addToResults(imdb_id, contents)
  {
    let videoInfo = await this.getVideoInfo(imdb_id);
    this.allResults[this.allResultsIndex] =
    {
      imdb_id: imdb_id,
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

  getResults(encodedSearchParams)
  {
    this.allResults = [];
    this.allResultsIndex = 0;
    //---> dont reset results if calling page 2+ (for infinite loading to push more results)
    
    return new Promise((resolve, reject) =>
    {
      this.http.get<{}>('http://localhost:3000/api/search' + encodedSearchParams)
        .toPromise()
        .then(response =>
              {
                Object.entries(response).forEach(values => this.addToResults(values[0], values[1]));
                resolve(this.allResults);
              },
              error => { reject(error); });
    });
  }
}

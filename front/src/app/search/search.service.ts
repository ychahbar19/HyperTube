import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
//import { ResultModel } from './result.model';

@Injectable()
export class SearchService
{
  /*
  private allResults: ResultModel[] = [];
  private allResultsIndex = 0;

  constructor(private http: HttpClient) {}

  //Add search results from multiple queries to one common set of results.
  addToResults(imdb_id, title)
  {
    this.allResults[this.allResultsIndex] =
    {
      imdb_id: imdb_id,
      title: title
    };
    this.allResultsIndex++;
  }

  //Get movies
  getMovies()
  {
    return new Promise((resolve, reject) =>
    {
      this.http.get<{}>('http://localhost:3000/api/search/movies')
        .toPromise()
        .then(response =>
              {
                Object.entries(response).forEach(values => this.addToResults(values[0], values[1]));
                resolve(this.allResults);
              },
              error => { reject(error); });
    });
  }

  //Get TV shows
  getTVShows()
  {
    return new Promise((resolve, reject) =>
    {
      this.http.get<{}>('http://localhost:3000/api/search/tvshows')
        .toPromise()
        .then(response =>
              {
                Object.entries(response).forEach(values => this.addToResults(values[0], values[1]));
                resolve(this.allResults);
              },
              error => { reject(error); });
    });
  }

  async getResults()
  {
    await this.getMovies();
    await this.getTVShows();
    return this.allResults;
  }
  */

  private allResults = [];
  private allResultsIndex = 0;

  constructor(private http: HttpClient) {}

  addToResults(imdb_id, contents)
  {
    this.allResults[this.allResultsIndex] =
    {
      imdb_id: imdb_id,
      title: contents.title,
      yts_id: contents.yts_id,
      eztv_id: contents.eztv_id
    };
    this.allResultsIndex++;
  }

  getResults()
  {
    return new Promise((resolve, reject) =>
    {
      this.http.get<{}>('http://localhost:3000/api/search/')
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

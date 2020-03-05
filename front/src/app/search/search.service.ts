import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
//import { YtsModel } from './result-yts.model';
//import { EztvModel } from './result-eztv.model';
import { ResultModel } from './result.model';

@Injectable()
export class SearchService
{
  private allResults: ResultModel[] = [];
  private allResultsIndex = 0;

  constructor(private http: HttpClient) {}

  /*
  //Get movies from YTS.
  getYtsResults()
  {
    return new Promise((resolve, reject) =>
    {
      this.http.get<{status: string, status_message: string, data: YtsModel}>('https://yts.mx/api/v2/list_movies.json?query_term=lord')
        .toPromise() //Converts the Observable into a Promise
        .then(
          response => { resolve(response.data); },
          error => { reject(error); });
    });
  }

  //Get TV shows from EZTV.
  getEztvResults()
  {
    return new Promise((resolve, reject) =>
    {
      this.http.get<EztvModel>('https://eztv.io/api/get-torrents')
        .toPromise()
        .then(
          response => { resolve(response); },
          error => { reject(error); });
    });
  }

  //Combine movies and TV shows into one set of results.
  addToResults(imdb_id, title)
  {
    this.allResults[this.allResultsIndex] =
    {
      imdb_id: imdb_id,
      title: title
    };
    this.allResultsIndex++;
  }

  async getResults()
  {
    const ytsResults = await this.getYtsResults();
    ytsResults['movies'].forEach(movie => this.addToResults(movie.imdb_code, movie.title));

    const eztvResults = await this.getEztvResults();
    eztvResults['torrents'].forEach((show) => this.addToResults('tt'+show.imdb_id, show.title));

    return this.allResults;
  }
  */


  addToResults(imdb_id, title)
  {
    this.allResults[this.allResultsIndex] =
    {
      imdb_id: imdb_id,
      title: title
    };
    this.allResultsIndex++;
  }

  async getResults()
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
}

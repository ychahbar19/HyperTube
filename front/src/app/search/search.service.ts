import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { Observable, Subject } from 'rxjs';

@Injectable()
export class SearchService
{
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

  getResults(encodedSearchParams)
  {
    this.allResults = [];
    this.allResultsIndex = 0;
    
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

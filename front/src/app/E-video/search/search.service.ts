import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SearchService
{
  constructor(private http: HttpClient) {}

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
        .then(response => { resolve(response); }, error => { reject(error); });
    });
  }
}

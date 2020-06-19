import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SearchService {
  constructor(private http: HttpClient) {}

  // Fetches the search results from YTS' API (back), then loops
  // through the object returned with the private function addToResults()
  // to save the results as an array that also includes IMDB info.
  // Returns that array.
  getResults(encodedSearchParams: string, lg: any, translatedGenres: any) {
    return new Promise((resolve, reject) => {
      this.http.get<{}>('http://localhost:3000/api/search' + encodedSearchParams)
        .toPromise()
        .then(response => {
            if (lg === 'fr') {
              Object.keys(response).forEach(key => {
                const vid = response[key];
                for (let i = 0; i < translatedGenres['en'].length; i++) {
                  vid['Genre'] = vid['Genre'].replace(translatedGenres['en'][i], translatedGenres['fr'][i]);
                }
              });
            }
            resolve(response);
          },
          error => { reject(error); }
        );
    });
  }

  isSeen(result) {
    return new Promise((resolve, reject) => {
      this.http.get<{}>('http://localhost:3000/api/video/isSeen/' + result)
        .toPromise()
        .then(async response => {
          console.log(response);
          resolve(response);
        },
        error => { reject(error); });
    });
  }
}

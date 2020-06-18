import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SearchService {
  constructor(private http: HttpClient) {}

  // Fetches the search results from YTS' API (back), then loops
  // through the object returned with the private function addToResults()
  // to save the results as an array that also includes IMDB info.
  // Returns that array.

  getResults(encodedSearchParams: string, lg, translatedGenres)
  {
    const thisClass = this;
    return new Promise((resolve, reject) =>
    {
      this.http.get<{}>('http://localhost:3000/api/search' + encodedSearchParams)
        .toPromise()
        .then(response =>
          {
            if (lg == 'fr')
            {
              Object.keys(response).forEach(async function(key)
              {
                let vid = response[key];
                const isSeen = await thisClass.checkIfSeen(vid.imdb_id);
                vid.isSeen = isSeen;
                for (let i = 0; i < translatedGenres['en'].length; i++)
                  vid['Genre'] = vid['Genre'].replace(translatedGenres['en'][i], translatedGenres['fr'][i]);
              });
            }
            resolve(response);
          },
          error => { reject(error); }
        );
    });
  }

  checkIfSeen(imdbId: string) {
    return new Promise((resolve, reject) => {
      this.http.get<any>('http://localhost:3000/api/video/isSeen/' + imdbId)
        .toPromise()
        .then(response => {
          // setTimeout(() => {
            resolve(response);
          // }, 1500);
        },
        error => { reject(error); });
    });
  }

  // isSeen(result) {
  //   return new Promise((resolve, reject) => {
  //     this.http.get<{}>('http://localhost:3000/api/video/isSeen/' + result)
  //       .toPromise()
  //       .then(async response => {
  //         console.log(response);
  //         resolve(response);
  //       },
  //       error => { reject(error); });
  //   });
  // }
}

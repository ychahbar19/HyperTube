import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/C-auth/auth.service';

@Injectable()
export class SearchService {
  constructor(private authService: AuthService,
              private http: HttpClient) {}

  // Fetches the search results from YTS' API (back), then loops
  // through the object returned with the private function addToResults()
  // to save the results as an array that also includes IMDB info.
  // Returns that array.

  getResults(encodedSearchParams: string, lg): Promise<object> {
    const thisClass = this;
    return new Promise((resolve, reject) => {
      this.http.get<{}>('http://localhost:3000/api/search' + encodedSearchParams)
        .toPromise()
        .then(response => {
          Object.keys(response).forEach(async key => {
            if (this.authService.getIsAuth()) {
              const vid = response[key];
              const isSeen = await thisClass.checkIfSeen(vid.imdb_id);
              vid.isSeen = isSeen;

              if (vid['imdbRating'] == undefined)
                vid['imdbRating'] = 0;
              vid['rating_average'] = vid['imdbRating'] / 2 + '/5';
              if (lg === 'fr')
                vid['rating_average'] = vid['rating_average'].replace('.', ',');
          
              if (vid['imdbVotes'] == 'N/A')
                vid['imdbVotes'] = 0;
              vid['ratings_count'] = '(' + vid['imdbVotes'] + ' votes)';
              if (lg === 'fr')
                vid['ratings_count'] = vid['ratings_count'].replace(',', '.');

              if (vid['Genre'] == 'N/A')
                vid['Genre'] = '';
              if (lg === 'fr' && vid['Genre'] != '')
              {
                vid['Genre'] = vid['Genre']
                .replace('Adventure', 'Aventure')
                .replace('Biography', 'Biographie')
                .replace('Comedy', 'Comédie')
                .replace('Documentary', 'Documentaire')
                .replace('Drama', 'Drame')
                .replace('Family', 'Famille')
                .replace('Fantasy', 'Fantaisie')
                .replace('History', 'Histoire')
                .replace('Horror', 'Horreur')
                .replace('Music', 'Musique')
                .replace('Musical', 'Comédie musicale')
                .replace('Mystery', 'Mystère')
                .replace('Short Film', 'Court-métrage')
                .replace('Superhero', 'Super-héro')
                .replace('War', 'Guerre');
              }
            }
          });
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
          resolve(response);
        },
        error => { reject(error); });
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VideoCardService {
  constructor(private http: HttpClient) {}

  // Fetches the video info from the API (back) and returns it.
  getVideoInfo(userLanguage: string, imdbId: string, ytsId: string) {
    return new Promise((resolve, reject) => {
      this.http.get<{}>('http://localhost:3000/api/video/' + userLanguage + '/' + imdbId + '/' + ytsId)
        .toPromise()
        .then(response => { resolve(response); },
              error => { reject(error); });
    });
  }

  async checkIfSeen(imdbId: string) {
    return new Promise((resolve, reject) => {
      this.http.get<any>('http://localhost:3000/api/video/isSeen/' + imdbId)
        .toPromise()
        .then(response => {
          setTimeout(() => {
            resolve(response);
          }, 1500);
        },
        error => { reject(error); });
    });
  }
}

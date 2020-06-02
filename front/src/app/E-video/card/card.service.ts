import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VideoCardService {
  constructor(private http: HttpClient) {}

  // Fetches the video info from the API (back) and returns it.
  getVideoInfo(imdb_id, yts_id) {
    return new Promise((resolve, reject) => {
      this.http.get<{}>('http://localhost:3000/api/video/' + imdb_id + '/' + yts_id)
        .toPromise()
        .then(response => { resolve(response); },
              error => { reject(error); });
    });
  }
}

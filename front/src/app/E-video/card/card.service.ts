import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VideoCardService
{
  constructor(private http: HttpClient) {}

  // Fetches the video info from the API (back) and returns it.
  getVideoInfo(user_language, imdbId, ytsId)
  {
    return new Promise((resolve, reject) => {
      this.http.get<{}>('http://localhost:3000/api/video/' + user_language + '/' + imdbId + '/' + ytsId)
        .toPromise()
        .then(response => { resolve(response); },
              error => { reject(error); });
    });
  }
}

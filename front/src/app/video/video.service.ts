import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Observable, Subject } from 'rxjs';
// import { VideoModel } from './video.model';

@Injectable()
export class VideoService {
  /*
  private video: VideoModel = {
                    _id: '',
                    name: '',
                    summary: ''
                  };
  private videoUpdated = new Subject<VideoModel>();

  constructor(private http: HttpClient) {}

  getVideo()
  {
    this.http.get<VideoModel>('http://localhost:3000/api/video/read/5e569fe21c9d440000e65b00')
      .subscribe((responseData) =>
      {
        this.video = responseData;
        this.videoUpdated.next(this.video);
      });
  }

  getVideoUpdateListener()
  {
    return this.videoUpdated.asObservable();
  }
  */

  constructor(private http: HttpClient) {}

  getVideoInfo(imdbId, ytsId) {
    return new Promise((resolve, reject) => {
      this.http.get<{}>('http://localhost:3000/api/video/' + imdbId + '/' + ytsId)
        .toPromise()
        .then(response => { resolve(response); },
              error => { reject(error); });
    });
  }

  streamVideo(torrentHash: object) {
    return new Promise(async (resolve, reject) => {
      const torrentPath = await this.http.post<{}>('http://localhost:3000/api/video/stream/', torrentHash)
        .toPromise()
        .then(response => { resolve(response); },
              error => { reject(error); });
    });
  }
}

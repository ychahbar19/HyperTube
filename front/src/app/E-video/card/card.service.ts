import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VideoCardService
{
  constructor(private http: HttpClient) {}

  // Fetches the video info from the API (back) and returns it.
  getVideoInfo(imdb_id, yts_id)
  {
    return new Promise((resolve, reject) =>
    {
      this.http.get<{}>('http://localhost:3000/api/video/'+imdb_id+'/'+yts_id)
        .toPromise()
        .then(response => { resolve(response); },
              error => { reject(error); });
    });
  }

  // Launches the video's download (starting at targetTime),
  // and its streaming when the video is downloaded at 1%.
  // Expects an object in response which contains the video's source url.
  streamVideo(
    torrentHash: object,
    targetTime: number = 0,
    duration: number = 0): Promise<{ start: number, status: string, src: string }>
  {
    const targetPercent = (targetTime / duration) * 100;
    const datas = { ...torrentHash, targetPercent };

    console.log(datas);
    
    return new Promise(async (resolve, reject) =>
    {
      this.http.post<{}>('http://localhost:3000/api/video/stream/', datas)
        .toPromise()
        .then((response: { start: number, status: string, src: string }) => { resolve(response); },
              (error) => { reject(error); });
    });
  }

  // listenToComplete(torrentHash: object) {
  //   return new Promise(async (resolve, reject) => {
  //     this.http
  //       .post<{}>('http://localhost:3000/api/video/listenComplete/', torrentHash)
  //       .toPromise()
  //       .then(
  //         response => {
  //           resolve(response);
  //         },
  //         error => {
  //           reject(error);
  //         }
  //       );
  //   });
  // }
}

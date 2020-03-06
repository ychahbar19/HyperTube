import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CommentsService
{
  constructor(private http: HttpClient) {}

  getComments()
  {
    return new Promise((resolve, reject) =>
    {
      this.http.get<[{}]>('http://localhost:3000/api/comments/read/tt0077869')
        .toPromise()
        .then(response => { console.log(response);resolve(response); },
              error => { reject(error); });
    });
  }
}

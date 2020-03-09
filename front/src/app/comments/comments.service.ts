import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CommentsService
{
  //headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  readComments(imdb_id)
  {
    return new Promise((resolve, reject) =>
    {
      this.http.get<[{}]>('http://localhost:3000/api/comments/read/'+imdb_id)
        .toPromise()
        .then(response => { resolve(response); },
              error => { reject(error); });
    });
  }

  postComment(imdb_id, comment)
  {
    return new Promise((resolve, reject) =>
    {
      let postedData = JSON.stringify(
      {
        imdb_id: imdb_id,
        author_name: comment.Name,
        content: comment.Comment
      });

      this.http.post('http://localhost:3000/api/comments/create', postedData);
      /*
        .toPromise()
        .then(response => { console.log(response);resolve(response); },
              error => { reject(error); });*/
    });
  }
}

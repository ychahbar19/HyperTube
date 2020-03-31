import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CommentsService
{
  constructor(private http: HttpClient) {}

  // Fetches the comments for the given video from the API (back)
  // and returns them as an array.
  fetchComments(imdb_id)
  {
    return new Promise((resolve, reject) =>
    {
      this.http.get<[{}]>('http://localhost:3000/api/comments/read/'+imdb_id)
        .toPromise()
        .then(response => { resolve(response); },
              error => { reject(error); });
    });
  }

  // Posts a new comment to the API (back) and returns an object with
  // 'message: OK' if the comment was properly saved in the database.
  postComment(imdb_id, comment)
  {
    return new Promise((resolve, reject) =>
    {
      let postedData =
      {
        imdb_id: imdb_id,
        author_name: comment.Name,
        content: comment.Comment
      };
      this.http.post('http://localhost:3000/api/comments/create', postedData)
        .toPromise()
        .then(response => { resolve(response); },
              error => { reject(error); });
    });
  }
}

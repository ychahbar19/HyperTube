import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CommentsService
{
  // private allComments = [];
  // private allCommentsIndex = 0;

  constructor(private http: HttpClient) {}

  // addToComments(comment)
  // {
  //   this.allComments[this.allCommentsIndex] =
  //   {
  //     mongodb_id: comment._id,
  //     author_name: comment.author_name,
  //     posted_datetime: comment.posted_datetime,
  //     content: comment.content
  //   };
  //   this.allCommentsIndex++;
  // }

  getComments(imdb_id)
  {
    return new Promise((resolve, reject) =>
    {
      this.http.get<[{}]>('http://localhost:3000/api/comments/read/'+imdb_id)
        .toPromise()
        .then(response =>
              {
                // Object.entries(response).forEach(values => this.addToComments(values[1]));
                // resolve(this.allComments);
                resolve(response);
              },
              error => { reject(error); });
    });
  }
}

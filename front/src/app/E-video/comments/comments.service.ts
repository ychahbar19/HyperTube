import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CommentsService {
  constructor(private http: HttpClient) {}

  // Fetches the comments for the given video from the API (back)
  // and returns them as an array.
  fetchComments(imdbId: string, language: string) {
    return new Promise((resolve, reject) => {
      this.http.get<[{}]>('http://localhost:3000/api/comments/read/' + imdbId + '/' + language)
        .toPromise()
        .then(response => { resolve(response); },
              error => { reject(error); });
    });
  }

  // Posts a new comment to the API (back) and returns an object with
  // 'message: OK' if the comment was properly saved in the database.
  postComment(imdbId: string, ytsId: string, comment: { Comment: string }, language: string) {
    return new Promise((resolve, reject) => {
      const postedData = {
        imdbId,
        ytsId,
        content: comment.Comment,
        language
      };
      this.http.post('http://localhost:3000/api/comments/create', postedData)
        .toPromise()
        .then(response => { resolve(response); },
              error => { reject(error); });
    });
  }
}

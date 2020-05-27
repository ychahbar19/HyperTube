import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService
{
  constructor(private http: HttpClient) {}

  // Fetches the video info from the API (back) and returns it.
  getUserInfo(user_id)
  {
    return new Promise((resolve, reject) =>
    {
      user_id = (user_id !== undefined) ? user_id : '';

      this.http.get<{}>('http://localhost:3000/api/user/profile/' + user_id)
        .toPromise()
        .then(response => { resolve(response); },
              error => { reject(error); });
    });
  }
}
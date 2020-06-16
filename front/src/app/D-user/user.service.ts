import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../shared/UserInterface';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  // Fetches the video info from the API (back) and returns it.
  getUserInfo(userId: string): Promise<User> {
    return new Promise((resolve, reject) => {
      userId = (userId !== undefined) ? userId : '';

      this.http.get<User>('http://localhost:3000/api/user/profile/' + userId)
        .toPromise()
        .then(response => { resolve(response); },
              error => { reject(error); });
    });
  }
}

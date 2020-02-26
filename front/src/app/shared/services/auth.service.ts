import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { UserModel } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user: UserModel;

  constructor(private http: HttpClient, private router: Router) { }

  // isAuthenticated(): boolean {
  //   const userData = localStorage.getItem('userInfo');
  //   console.log(userData);
  //   if (userData && JSON.parse(userData)) {
  //     return true;
  //   }
  //   return false;
  // }

  signIn(formData) {
    this.http.post<UserModel>('http://localhost:3000/signin', formData)
      .subscribe(response => {
        if (response) {
          this.user = response;
          console.log(this.user);
          localStorage.setItem('userId', JSON.stringify(this.user.id));
          console.log(localStorage.getItem('userId'));
          console.log(localStorage.getItem('user'));
          // this.router.navigate(['/']);
        }
        console.log(response);
      });
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { UserModel } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user: UserModel;

  constructor(private http: HttpClient, private router: Router) { }

  signIn(formData) {
    this.http.post<UserModel>('http://localhost:3000/signin', formData)
      .subscribe(response => {
        if (response) {
          this.user = response;
          console.log(this.user);
          this.router.navigate(['/']);
        }
      });
  }

  signUp(formData){
    this.http.post<UserModel>('http://localhost:3000/signup', formData)
      .subscribe(response => {
        if (response) {
          this.user = response;
          this.router.navigate(['/signin']);
        }
      });
  }

}

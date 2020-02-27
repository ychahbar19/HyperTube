import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserModel } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user: UserModel;
  errors: any[] = [];
  obsLogin: Observable<{}>;

  constructor(private http: HttpClient, private router: Router) { }

  // isAuthenticated(): boolean {
  //   const userData = localStorage.getItem('userInfo');
  //   console.log(userData);
  //   if (userData && JSON.parse(userData)) {
  //     return true;
  //   }
  //   return false;
  // }

  signIn(formData: { username: string, password: string }): Observable<any> {

      return this.http.post<any>('http://localhost:3000/signin', formData);

  //   this.http.post<any>('http://localhost:3000/signin', formData)
  //     .subscribe(response => {

        // if (response.inputErrors) {
        //   this.errors = response.inputErrors;









  //         this.user = response;
  //         localStorage.setItem('userId', JSON.stringify(this.user.id));
  //         // console.log(localStorage.getItem('userId'));
  //         // console.log(localStorage.getItem('user'));
  //         this.router.navigate(['/signin']);
  //       } else {
  //         this.router.navigate(['/signin'], { queryParams: {error: '1'} });
  //         // this.error = 'Wrong username and/or password';
  //         // console.log(this.error);
  //       }
  //     });
  //   // console.log(response);
  }

}

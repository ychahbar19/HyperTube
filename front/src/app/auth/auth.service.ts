import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(
    formData: {
      firstName: string,
      lastName: string,
      username: string,
      email: string,
      passwords: {
        password: string,
        confirmPassword: string
      }
    }
  ) {
    const authData: AuthData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: formData.email,
      password: formData.passwords.password,
      confirmPassword: formData.passwords.confirmPassword
    };
    this.http.post('http://localhost:3000/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  // signIn(formData: { username: string, password: string }): Observable<any> {
  login(formData: { username: string, password: string }) {
    const authData: AuthData = { username: formData.username, password: formData.password };
    this.http.post<{token: string}>('http://localhost:3000/signin', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/gallery']);
        }
      });
    // return this.http.post<any>('http://localhost:3000/signin', authData);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }

}

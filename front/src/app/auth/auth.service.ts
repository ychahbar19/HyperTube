import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private isLoading = new Subject<boolean>();

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

  getIsLoading() {
    return this.isLoading.asObservable();
  }
  // update a user informations such as firstname, lastname, username and email
  updateUser(
    formData: {
      avatar: File | string,
      firstName: string,
      lastName: string,
      username: string,
      email: string
    }
  ) {
    const updateData = new FormData();
    updateData.append('photoUrl', formData.avatar);
    updateData.append('firstName', formData.firstName);
    updateData.append('lastName', formData.lastName);
    updateData.append('username', formData.username);
    updateData.append('email', formData.email);
    this.isLoading.next(true);
    return this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/editProfile', updateData)
      .subscribe(response => {
        // update du cookie dans le localStorage pour une duree set en back
        this.isLoading.next(false);
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  // create a user
  createUser(
    formData: {
      avatar: File,
      firstName: string,
      lastName: string,
      username: string,
      email: string,
      password: string,
      confirmPassword: string
    }
  ) {
    const authData = new FormData();
    authData.append('photoUrl', formData.avatar);
    authData.append('firstName', formData.firstName);
    authData.append('lastName', formData.lastName);
    authData.append('username', formData.username);
    authData.append('email', formData.email);
    authData.append('password', formData.password);
    authData.append('confirmPassword', formData.confirmPassword);
    return this.http.post('http://localhost:3000/signup', authData)
      .subscribe(response => {
        console.log(response);
        // if success : alert success + send mail avec l'id ?
        // garder l'id quelque part ou aller le rechercher au login pour le mettre en cookie
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(formData: { username: string, password: string }) {
    const authData: AuthData = { username: formData.username, password: formData.password };
    this.isLoading.next(true);
    this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/signin', authData)
      .subscribe(response => {
        this.isLoading.next(false);
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate);
          this.router.navigate(['/gallery']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  // Auto authenticate user if token exists and is still valid (duration wise)
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return ;
    }
    const now = new Date();
    // getTime() -> number of miliseconds since 1 jan 1970 and the date
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.setAuthTimer(expiresIn / 1000);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return ;
    }
    return {
      token,
      expirationDate: new Date(expirationDate)
    };
  }

}

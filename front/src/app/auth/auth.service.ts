import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { LoadingService } from '../shared/services/loading.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router, private loadingService: LoadingService) { }

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
    this.http.post('http://localhost:3000/api/auth/signup', authData)
      .subscribe(response => {
        // if error : alert error (pareil pour login)
        // if success : alert success + send mail
      });
  }

  login(formData: { username: string, password: string }) {
    const authData: AuthData = { username: formData.username, password: formData.password };
    this.loadingService.isLoading.next(true);
    this.http
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/api/auth/login',
        authData
      )
      .subscribe(response => {
        this.loadingService.isLoading.next(false);
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate);
          this.router.navigate(['/gallery']);
        }
      });
  }

  loginWithProvider(provider: string) {
    this.http.get('http://localhost:3000/api/auth/' + provider)
      .subscribe(response => {
        console.log(response);
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

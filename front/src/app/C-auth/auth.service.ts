import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /* ------------------------------------------------------- *\
      Private and public variables.
  \* ------------------------------------------------------- */

  /* ----- Listeners for status changes -----*/

  private authServiceWorkingListener = new Subject<boolean>(); // Tracks if this service is running/done.
  private signupSuccessListener = new Subject<boolean>(); // Tracks if the signup process is a success.
  private editSuccessListener = new Subject<boolean>(); // Tracks if the signup process is a success.
  private resetStatusListener = new Subject<boolean>();

  /* ----- Auth status & token info -----*/

  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;

  /* ----- ???? -----*/

  public resetPasswordSuccessMessage: number;

  constructor(private http: HttpClient, private router: Router) {}

  /* ------------------------------------------------------------------ *\
      Public getters for the private variables.
  \* ------------------------------------------------------------------ */

  getAuthServiceWorkingListener() {
    return this.authServiceWorkingListener.asObservable();
  }

  getSignupSuccessListener() {
    return this.signupSuccessListener.asObservable();
  }

  getEditSuccessListener() {
    return this.editSuccessListener.asObservable();
  }

  getResetStatusListener() {
    return this.resetStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  /* ------------------------------------------------------------------ *\
      SIGNUP
  \* ------------------------------------------------------------------ */

  // Takes the 'signup' form input as parameter.
  signup(formData: {
    avatar: File;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    // Translate the input into another format.
    const authData = new FormData();
    authData.append('photoUrl', formData.avatar);
    authData.append('firstName', formData.firstName);
    authData.append('lastName', formData.lastName);
    authData.append('username', formData.username);
    authData.append('email', formData.email);
    authData.append('password', formData.password);
    authData.append('confirmPassword', formData.confirmPassword);

    // Calls the API (back) for the signup process. If the signup is a success,
    // sets signupSuccessListener to TRUE. And in any case, once the process is done,
    // sets authServiceWorkingListener to FALSE.
    this.http.post('http://localhost:3000/api/auth/signup', authData).subscribe(
      response => {
        this.signupSuccessListener.next(true);
        this.authServiceWorkingListener.next(false);
      },
      error => {
        this.authServiceWorkingListener.next(false);
      }
    );
  }

  //  ACTIVATE THE ACCOUNT

  activateAccount(userId: string) {
    // Calls the API's (back) activateAccount process
    return this.http.post('http://localhost:3000/api/auth/activateAccount', {
      id: userId,
    });
  }

  /* ------------------------------------------------------------------ *\
      SIGNIN
  \* ------------------------------------------------------------------ */

  // Omniauth
  applyOmniauthSignin(response) {
    this.token = response.token;
    if (this.token) {
      this.connectUser(response);
      this.router.navigate(['/search']);
    }
  }

  // Connects the user and sets the token timer
  connectUser(response: { token: string; expiresIn: number }) {
    const expiresInDuration = response.expiresIn;
    this.setAuthTimer(expiresInDuration);
    this.isAuthenticated = true;
    this.authServiceWorkingListener.next(true);
    const now = new Date();
    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
    this.saveAuthData(this.token, expirationDate);
  }

  // Takes the 'signin' form input as parameter.
  login(formData: { username: string; password: string }) {
    // Calls the API (back) for the signin process.
    // If the signin is a success, gets the token and token expiration in response,
    // calls applySuccessSignin(), and redirects to /search.
    this.http
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/api/auth/signin',
        formData
      )
      .subscribe(
        response => {
          this.token = response.token;
          if (this.token) {
            this.connectUser(response);
            this.router.navigate(['/search']);
          }
        },
        error => {
          this.authServiceWorkingListener.next(false);
        }
      );
  }

  /* ------------------------------------------------------------------ *\
      FORGOTTEN PASSWORD
  \* ------------------------------------------------------------------ */

  // Takes the 'forgot password' form input as parameter.
  forgotPassword(formData: { username: string }) {
    // Calls the API's (back) forgotPassword process.
    // If the call is a success (i.e. email is sent to rest password),
    // sets the resetPasswordSuccessMessage.
    // And in any case, once the process is done,
    // sets authServiceWorkingListener to FALSE.
    this.http
      .post('http://localhost:3000/api/auth/forgotPassword', formData)
      .subscribe(
        response => {
          this.resetPasswordSuccessMessage = 1;
          this.authServiceWorkingListener.next(false);
        },
        error => {
          this.resetPasswordSuccessMessage = 0;
          this.authServiceWorkingListener.next(false);
        }
      );
  }

  /* ------------------------------------------------------------------ *\
      RESET PASSWORD
  \* ------------------------------------------------------------------ */

  // Takes the user id/hash and reset password form data as parameter.
  resetPassword(
    id: string,
    hash: string,
    formData: { password: string; confirmPassword: string }
  ) {
    // Translate the input into another format.
    const datas = { id, hash, formData };

    // Calls the back's resetPassword process.
    // If the reset is a success, sets the resetPasswordSuccessMessage.
    // And in any case, once the process is done, sets authServiceWorkingListener to FALSE.
    this.http
      .post('http://localhost:3000/api/auth/resetPassword', datas)
      .subscribe(
        response => {
          this.resetPasswordSuccessMessage = 2;
          this.authServiceWorkingListener.next(false);
        },
        error => {
          this.resetPasswordSuccessMessage = 0;
          this.authServiceWorkingListener.next(false);
        }
      );
  }

  /* ------------------------------------------------------------------ *\
      UPDATE USER (ON EDIT)
  \* ------------------------------------------------------------------ */

  updateUser(formData: {
    avatar: File | string;
    language: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    const updateData = new FormData();
    updateData.append('photoUrl', formData.avatar);
    updateData.append('language', formData.language);
    updateData.append('firstName', formData.firstName);
    updateData.append('lastName', formData.lastName);
    updateData.append('username', formData.username);
    updateData.append('email', formData.email);
    updateData.append('password', formData.password);
    updateData.append('confirmPassword', formData.confirmPassword);

    const authInformation = this.getAuthData();
    const now = new Date();
    const expiresInSeconds = (
      (authInformation.expirationDate.getTime() - now.getTime()) /
      1000
    ).toString();
    updateData.append('remainingTime', expiresInSeconds);

    return this.http
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/api/user/editProfile',
        updateData
      )
      .subscribe(
        response => {
          this.editSuccessListener.next(true);
          this.token = response.token;
          if (this.token) {
            this.connectUser(response);
          }
        },
        error => {
          this.authServiceWorkingListener.next(false);
        }
      );
  }

  /* ------------------------------------------------------------------ *\
      LOGOUT
  \* ------------------------------------------------------------------ */

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authServiceWorkingListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  /* ------------------------------------------------------------------ *\
      AUTH TOKEN OPERATIONS
  \* ------------------------------------------------------------------ */

  // Sets token and its expiration date in localStorage
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  // Returns the token and its expiration date if both exist from localStorage
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return { token, expirationDate: new Date(expirationDate) };
  }

  // Deletes token and its expiration date from localStorage
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  // Sets timer after what user is disconnected
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  // Auto authenticate user if token exists and is still valid (duration wise)
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    // getTime() -> number of MILISECONDS since 1 jan 1970 and the date
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.setAuthTimer(expiresIn / 1000);
      this.isAuthenticated = true;
      this.authServiceWorkingListener.next(true);
    }
  }
}

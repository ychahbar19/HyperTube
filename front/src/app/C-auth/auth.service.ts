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
  private resetStatusListener = new Subject<boolean>();

  /* ----- Auth status & token info -----*/

  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;

  /* ----- ???? -----*/

  public resetPasswordSuccessMessage: number;

  constructor(private http: HttpClient,
              private router: Router) {}

  /* ------------------------------------------------------------------ *\
      Public getters for the private variables.
  \* ------------------------------------------------------------------ */

  getAuthServiceWorkingListener() { return this.authServiceWorkingListener.asObservable(); }
  getSignupSuccessListener()      { return this.signupSuccessListener.asObservable(); }
  getResetStatusListener()        { return this.resetStatusListener.asObservable(); }
  getIsAuth()                     { return this.isAuthenticated; }
  getToken()                      { return this.token; }

  /* ------------------------------------------------------------------ *\
      SIGNUP
  \* ------------------------------------------------------------------ */

  // Takes the 'signup' form input as parameter.
  signup(formData:
    {
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
    this.http.post('http://localhost:3000/api/auth/signup', authData)
      .subscribe(
        response => {
          this.signupSuccessListener.next(true);
          this.authServiceWorkingListener.next(false);
        },
        error => { this.authServiceWorkingListener.next(false); }
      );
  }

  /* ------------------------------------------------------------------ *\
      ACTIVATE ACCOUNT
  \* ------------------------------------------------------------------ */

  // Takes the user id as parameter.
  activateAccount(id: string) {
    // Calls the API's (back) activateAccount process,
    // and returns its confirmation message          ?????????????
    return this.http.post('http://localhost:3000/api/auth/activateAccount', { id });
  }

  /* ------------------------------------------------------------------ *\
      SIGNIN
  \* ------------------------------------------------------------------ */

  applySuccessSignin(response) {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + response.expiresIn * 1000);
    const expiresInDuration = response.expiresIn;

    this.isAuthenticated = true;
    this.tokenTimer = setTimeout(() => { this.logout(); }, expiresInDuration * 1000);
    localStorage.setItem('token', this.token);
    localStorage.setItem('expiration', expirationDate.toISOString());

    this.authServiceWorkingListener.next(true);
    this.router.navigate(['/search']);
  }

  // Takes the 'signin' form input as parameter.
  login(formData: { username: string, password: string }) {
    // Calls the API (back) for the signin process.
    // If the signin is a success, gets the token and token expiration in response,
    // calls applySuccessSignin(), and redirects to /search.
    this.http.post<{ token: string; expiresIn: number }>('http://localhost:3000/api/auth/signin', formData)
      .subscribe(
        response => {
          this.token = response.token;
          if (this.token) {
            this.applySuccessSignin(response);
          }
        },
        error => { this.authServiceWorkingListener.next(false); }
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
    this.http.post('http://localhost:3000/api/auth/forgotPassword', formData)
      .subscribe(
        response => { this.resetPasswordSuccessMessage = 1; this.authServiceWorkingListener.next(false); },
        error =>    { this.resetPasswordSuccessMessage = 0; this.authServiceWorkingListener.next(false); }
      );
  }

  /* ------------------------------------------------------------------ *\
      RESET PASSWORD
  \* ------------------------------------------------------------------ */

  // Takes the user id/hash and reset password form data as parameter.
  resetPassword(
    id: string,
    hash: string,
    formData: { password: string; confirmPassword: string }) {

    // Translate the input into another format.
    const datas = { id, hash, formData };

    // Calls the back's resetPassword process.
    // If the reset is a success, sets the resetPasswordSuccessMessage.
    // And in any case, once the process is done, sets authServiceWorkingListener to FALSE.
    this.http.post('http://localhost:3000/api/auth/resetPassword', datas)
      .subscribe(
        response => { this.resetPasswordSuccessMessage = 2; this.authServiceWorkingListener.next(false); },
        error =>    { this.resetPasswordSuccessMessage = 0; this.authServiceWorkingListener.next(false); }
      );
  }

  /* ------------------------------------------------------------------ *\
      LOGOUT
  \* ------------------------------------------------------------------ */

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    this.isAuthenticated = false;
    this.token = null;
    clearTimeout(this.tokenTimer);
    this.authServiceWorkingListener.next(false);
    this.router.navigate(['/']);
  }

  /* ------------------------------------------------------------------ *\
      S
  \* ------------------------------------------------------------------ */

  // Auto authenticate user if token exists and is still valid (duration wise)
  autoAuthUser() {
    let authInformation: any;
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      authInformation = null;
    } else {
      authInformation = { token, expirationDate: new Date(expirationDate) };
    }

    if (!authInformation) { return; }

    const now = new Date();
    const expiresInDuration = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresInDuration > 0) {
      this.token = authInformation.token;
      this.tokenTimer = setTimeout(() => { this.logout(); }, expiresInDuration * 1000);
      this.isAuthenticated = true;
      this.authServiceWorkingListener.next(true);
    }
  }
    /* ------------------------------------------------------------------ *\
      UPDATE USER (ON EDIT)
    \* ------------------------------------------------------------------ */
  updateUser(
    formData: {
      avatar: File | string,
      firstName: string,
      lastName: string,
      username: string,
      email: string
    }
  ){
    const updateData = new FormData();
    updateData.append('photoUrl', formData.avatar);
    updateData.append('firstName', formData.firstName);
    updateData.append('lastName', formData.lastName);
    updateData.append('username', formData.username);
    updateData.append('email', formData.email);
    // this.loading.next(true);
    return this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/user/editProfile', updateData)
      .subscribe(response => {
        // update du cookie dans le localStorage
        // this.isLoading.next(false);
        console.log(response);
        
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          // ne marche plus comme avant pour update le token
          // this.setAuthTimer(expiresInDuration);
          //   this.isAuthenticated = true;
          this.authServiceWorkingListener.next(true);
          //   const now = Date();
          //   const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          //   this.saveAuthData(token, expirationDate);
        // }

      }
      }, error => {
      this.authServiceWorkingListener.next(false);
    })
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
//import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService
{
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

  public resetPasswordSuccessMessage: string;
  
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

  signup(formData: // Takes the 'signup' form input as parameter.
    {
      avatar: File;
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
    })
  {
    const authData = new FormData(); // Translates the input into another format.
    authData.append('photoUrl', formData.avatar);
    authData.append('firstName', formData.firstName);
    authData.append('lastName', formData.lastName);
    authData.append('username', formData.username);
    authData.append('email', formData.email);
    authData.append('password', formData.password);
    authData.append('confirmPassword', formData.confirmPassword);

    // Calls the API (back) for the signup process.
    // If the signup is a success, sets signupSuccessListener to TRUE.
    // And in any case, once the process is done,
    // sets authServiceWorkingListener to FALSE.
    this.http.post('http://localhost:3000/api/auth/signup', authData)
      .subscribe(
        response =>
        {
          this.signupSuccessListener.next(true);
          this.authServiceWorkingListener.next(false);
        },
        error => { this.authServiceWorkingListener.next(false); }
      );
  }

  /* ------------------------------------------------------------------ *\
      ACTIVATE ACCOUNT
  \* ------------------------------------------------------------------ */

  activateAccount(id: string) //Takes the user id as parameter.
  {
    // Calls the API's (back) activateAccount process,
    // and returns its confirmation message          ?????????????
    return this.http.post('http://localhost:3000/api/auth/activateAccount', { id });
  }
  
  /* ------------------------------------------------------------------ *\
      SIGNIN
  \* ------------------------------------------------------------------ */

  private applySuccessSignin(response)
  {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + response.expiresIn * 1000);
    const expiresInDuration = response.expiresIn;

    this.isAuthenticated = true;
    //this.setAuthTimer(expiresInDuration);
    this.tokenTimer = setTimeout(() => { this.logout(); }, expiresInDuration * 1000);
    //this.saveAuthData(this.token, expirationDate);
    localStorage.setItem('token', this.token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }
  
  login(formData: // Takes the 'signin' form input as parameter.
    {
      username: string;
      password: string
    })
  {
    // Calls the API (back) for the signin process.
    // If the signin is a success, gets the token and token expiration in response,
    // calls applySuccessSignin(), and redirects to /search.
    this.http.post<{ token: string; expiresIn: number }>('http://localhost:3000/api/auth/signin', formData)
      .subscribe(
        response =>
        {
          this.token = response.token;
          if (this.token)
          {
            this.applySuccessSignin(response);
            this.authServiceWorkingListener.next(true); /////////////////
            this.router.navigate(['/search']);
          }
        },
        error => { this.authServiceWorkingListener.next(false); }
      );
  }
  
  /* ------------------------------------------------------------------ *\
      FORGOTTEN PASSWORD
  \* ------------------------------------------------------------------ */
  
  forgotPassword(formData: { username: string }) // Takes the 'forgot password' form input as parameter.
  {
    // Calls the API's (back) forgotPassword process.
    // If the call is a success (i.e. email is sent to rest password),
    // sets the resetPasswordSuccessMessage.
    // And in any case, once the process is done,
    // sets authServiceWorkingListener to FALSE.
    this.http.post('http://localhost:3000/api/auth/forgotPassword', formData)
      .subscribe(
        response =>
        {
          this.resetPasswordSuccessMessage = 'We just sent you an email to the email address associated to this account. Check it and follow the steps';
          this.authServiceWorkingListener.next(false);
        },
        error =>
        {
          this.resetPasswordSuccessMessage = '';
          this.authServiceWorkingListener.next(false);
        }
      );
  }

  /* ------------------------------------------------------------------ *\
      RESET PASSWORD
  \* ------------------------------------------------------------------ */

  resetPassword( // Takes the user id/hash and reset password form data as parameter.
    id: string,
    hash: string,
    formData: { password: string; confirmPassword: string })
  {
    const datas = { id, hash, formData }; // Translates the input into another format.
    
    // Calls the back's resetPassword process.
    // If the reset is a success, sets the resetPasswordSuccessMessage.
    // And in any case, once the process is done,
    // sets authServiceWorkingListener to FALSE.
    this.http.post('http://localhost:3000/api/auth/resetPassword', datas)
      .subscribe(
        response =>
        {
          this.resetPasswordSuccessMessage = 'Your password has been successfully changed! You may now log in with your new password';
          this.authServiceWorkingListener.next(false);
        },
        error =>
        {
          this.resetPasswordSuccessMessage = '';
          this.authServiceWorkingListener.next(false);
        }
      );
  }

  /* ------------------------------------------------------------------ *\
      LOGOUT
  \* ------------------------------------------------------------------ */

  /*private clearAuthData()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }*/
  logout()
  {
    //this.clearAuthData();
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
/*
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
    // this.isLoading.next(true);
    return this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/user/editProfile', updateData)
      .subscribe(response => {
        // update du cookie dans le localStorage pour une duree set en back
        // this.isLoading.next(false);
        const token = response.token;
        this.token = token;
        if (this.token) {
          const expiresInDuration = response.expiresIn;
          //this.setAuthTimer(expiresInDuration);
          this.tokenTimer = setTimeout(() => { this.logout(); }, expiresInDuration * 1000);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          //this.saveAuthData(token, expirationDate);
          localStorage.setItem('token', this.token);
          localStorage.setItem('expiration', expirationDate.toISOString());
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }
  */

  /* ------------------------------------------------------------------ *\
      S
  \* ------------------------------------------------------------------ */

/*
  private getAuthData()
  {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate)
      return;
    return { token, expirationDate: new Date(expirationDate) };
  }
  */

  // Auto authenticate user if token exists and is still valid (duration wise)
  autoAuthUser()
  {
    //const authInformation = this.getAuthData();
        let authInformation;
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        if (!token || !expirationDate)
          authInformation = null;
        else
          authInformation = { token, expirationDate: new Date(expirationDate) };

    if (!authInformation)
      return;

    const now = new Date();
    // getTime() -> number of miliseconds since 1 jan 1970 and the date
    const expiresInDuration = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresInDuration > 0)
    {
      this.token = authInformation.token;
      //this.setAuthTimer(expiresInDuration / 1000);
      this.tokenTimer = setTimeout(() => { this.logout(); }, expiresInDuration * 1000);
      this.isAuthenticated = true;
      this.authServiceWorkingListener.next(true);
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService
{
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private creationStatusListener = new Subject<boolean>();
  private resetStatusListener = new Subject<boolean>();

  public resetPasswordSuccessMessage: string;

  constructor(private http: HttpClient, private router: Router) {}

  /* ------------------------------------------------------------------ *\
      Public getters
  \* ------------------------------------------------------------------ */

  getIsAuth()                 { return this.isAuthenticated; }
  getToken()                  { return this.token; }
  getAuthStatusListener()     { return this.authStatusListener.asObservable(); }
  getCreationStatusListener() { return this.creationStatusListener.asObservable(); }
  getResetStatusListener()    { return this.resetStatusListener.asObservable(); }

  /* ------------------------------------------------------------------ *\
      Private functions
  \* ------------------------------------------------------------------ */

  private saveAuthData(token: string, expirationDate: Date)
  {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }
  private setAuthTimer(duration: number)
  {
    this.tokenTimer = setTimeout(() => { this.logout(); }, duration * 1000);
  }

  /* ------------------------------------------------------------------ *\
      SIGNUP
      - Takes the 'signup' form input as parameter.
      - Calls the back's signup process.
      - Sets creationStatusListener() as TRUE on success.
  \* ------------------------------------------------------------------ */

  createUser(formData:
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
    const authData = new FormData();
    authData.append('photoUrl', formData.avatar);
    authData.append('firstName', formData.firstName);
    authData.append('lastName', formData.lastName);
    authData.append('username', formData.username);
    authData.append('email', formData.email);
    authData.append('password', formData.password);
    authData.append('confirmPassword', formData.confirmPassword);

    this.http.post('http://localhost:3000/api/auth/signup', authData)
      .subscribe(
        response =>
        {
          this.authStatusListener.next(false);
          this.creationStatusListener.next(true);
          /*
          *
          garder l'id quelque part ou aller le rechercher au login pour le mettre en cookie
          *
          */
        },
        error => { this.authStatusListener.next(false); }
      );
  }

  /* ------------------------------------------------------------------ *\
      ACTIVATE ACCOUNT
      - Takes the user id as parameter.
      - Calls the back's activateAccount process.

      - Returns the back's confirmation message ?????
  \* ------------------------------------------------------------------ */

  activateAccount(id: string)
  {
    return this.http.post('http://localhost:3000/api/auth/activateAccount', { id });
  }
  
  /* ------------------------------------------------------------------ *\
      SIGNIN
      - Takes the 'signin' form input as parameter.
      - Calls the back's signin process.
      - 
  \* ------------------------------------------------------------------ */

  login(formData: { username: string; password: string })
  {
    const authData: AuthData =
    {
      username: formData.username,
      password: formData.password
    };

    this.http.post<{ token: string; expiresIn: number }>('http://localhost:3000/api/auth/signin', authData)
      .subscribe(
        response =>
        {
          this.token = response.token;
          if (this.token)
          {
            const now = new Date();
            const expirationDate = new Date(now.getTime() + response.expiresIn * 1000);

            this.isAuthenticated = true;
            this.setAuthTimer(response.expiresIn);
            this.saveAuthData(this.token, expirationDate);
            this.authStatusListener.next(true);
            this.router.navigate(['/search']);
          }
        },
        error => { this.authStatusListener.next(false); }
      );
  }
  
  /* ------------------------------------------------------------------ *\
      FORGOTTEN PASSWORD
      - Takes the 'forgot password' form input as parameter.
      - Calls the back's forgotPassword process.
      - 
  \* ------------------------------------------------------------------ */
  
  forgotPassword(formData: { username: string })
  {
    this.http.post('http://localhost:3000/api/auth/forgotPassword', formData)
      .subscribe(
        response =>
        {
          // tslint:disable-next-line: max-line-length
          this.resetPasswordSuccessMessage = 'We just sent you an email to the email address associated to this account. Check it and follow the steps';
          this.authStatusListener.next(false);
        },
        error =>
        {
          // check if error then success if only one alert at once
          console.log(error);
          this.resetPasswordSuccessMessage = '';
          this.authStatusListener.next(false);
        }
      );
  }

  /* ------------------------------------------------------------------ *\
      RESET PASSWORD
      - Takes the user id/hash and reset password form data as parameter.
      - Calls the back's resetPassword process.
  \* ------------------------------------------------------------------ */

  resetPassword(
    id: string,
    hash: string,
    formData: { password: string; confirmPassword: string })
  {
    const datas = { id, hash, formData };
    this.http.post('http://localhost:3000/api/auth/resetPassword', datas)
      .subscribe(
        response =>
        {
          this.resetPasswordSuccessMessage = 'Your password has been successfully changed! You may now log in with your new password';
          this.authStatusListener.next(false);
        },
        error =>
        {
          // check if error then success if only one alert at once
          console.log(error);
          this.resetPasswordSuccessMessage = '';
          this.authStatusListener.next(false);
        }
      );
  }

  /* ------------------------------------------------------------------ *\
      LOGOUT
      - Takes ..... as parameter.
      - Calls the back's ..... process.
      - 
  \* ------------------------------------------------------------------ */

  /*
  private clearAuthData()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
  */

  logout()
  {
    this.isAuthenticated = false;
    this.token = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    //this.clearAuthData();
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    this.router.navigate(['/']);
  }

  /* ------------------------------------------------------------------ *\
      S
      - Takes ..... as parameter.
      - Calls the back's ..... process.
  \* ------------------------------------------------------------------ */

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

  


  private getAuthData()
  {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate)
      return;
    return { token, expirationDate: new Date(expirationDate) };
  }
  // Auto authenticate user if token exists and is still valid (duration wise)
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
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
}

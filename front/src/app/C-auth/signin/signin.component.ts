import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AppComponent } from '../../app.component';
import { AuthService } from '../auth.service';
import { ErrorService } from 'src/app/error/error.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, OnDestroy
{
  /* ------------------------------------------------------- *\
      User language & translations for the static text.
  \* ------------------------------------------------------- */

  public lg = AppComponent.userLanguage;
  public txt = {
    'Sign in':            { en: 'Sign in', fr: 'Connexion' },
    'with':               { en: 'with', fr: 'avec' },
    'Username':           { en: 'Username', fr: 'Pseudo' },
    'Username error':     { en: 'Invalid username.', fr: 'Pseudo invalide.' },
    'Password':           { en: 'Password', fr: 'Mot de passe' },
    'Password error':     { en: 'Invalid password.', fr: 'Mot de passe invalide.' },
    'Remember me':        { en: 'Remember me', fr: 'Rester connecté' },
    'Forgotten password': { en: 'Forgotten password?', fr: 'Mot de passe oublié ?' },
    'Submit':             { en: 'Submit', fr: 'Envoyer' },
    'No account yet':     { en: 'Don\'t have an account?', fr: 'Pas encore de compte ?' },
    'Sign up':            { en: 'Sign up', fr: 'Inscription' }
  };

  /* ------------------------------------------------------- *\
      Listeners for status changes. 
  \* ------------------------------------------------------- */

  private authServiceWorkingSub: Subscription; //Tracks if auth.service is running/done.
  private accountStatusSub: Subscription; //Tracks .....
  private errorStatusSub: Subscription; //Gets any error from the API (back).

  /* ------------------------------------------------------- *\
      Public variables.
  \* ------------------------------------------------------- */

  public isLoading = false;
  public successSignup = false;
  public errorMessage: string;

  /* ------------------------------------------------------- *\
      U
  \* ------------------------------------------------------- */

  @ViewChild('f', { static: false }) signInForm: NgForm;
  response: Observable<any>;

  /* ------------------------------------------------------- *\
      Initialisation
  \* ------------------------------------------------------- */

  constructor(private authService: AuthService,
              private errorService: ErrorService,
              private route: ActivatedRoute) {}

  ngOnInit(): void
  {
    // Listens to know when auth.service is ready (=when it's done running)
    // and then sets isLoading (=spinner) to FALSE.
    this.authServiceWorkingSub = this.authService.getAuthServiceWorkingListener()
      .subscribe(sub => { this.isLoading = false; }
    );
    //------>>>> same as signup

    // When the URL contains an id,
    // triggers the service's activateAccount() function.
    if (this.route.snapshot.queryParams.id)
    {
      this.isLoading = true;
      this.accountStatusSub = this.authService.activateAccount(this.route.snapshot.queryParams.id).subscribe(
        success =>
        {
          this.isLoading = false;
          this.successSignup = true;
        },
        error =>
        {
          this.isLoading = false;
          this.errorMessage = error.error.message;
        }
      );
    }

    // Listens to errors from the signin API process.
    this.errorStatusSub = this.errorService.errorObs.subscribe(
      errors_array => { this.errorMessage = errors_array['message']; }
    );
  }

  /* ------------------------------------------------------- *\
      Dealing with form submission.
  \* ------------------------------------------------------- */

  // When the form is submitted, if it's valid, sets the loading status
  // as true while authService.signin connects to the API (back) to
  // signin the user.
  onLogin()
  {
    if (this.signInForm.invalid)
      return;
    this.isLoading = true;
    this.authService.login(this.signInForm.value);
  }
  //------>>>> compare with signup wording

  /* ------------------------------------------------------- *\
      End
  \* ------------------------------------------------------- */

  ngOnDestroy()
  {
    this.authServiceWorkingSub.unsubscribe();
    if (this.accountStatusSub)
      this.accountStatusSub.unsubscribe();
    this.errorStatusSub.unsubscribe();
  }
}

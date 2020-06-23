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
export class SigninComponent implements OnInit, OnDestroy {
  /* ------------------------------------------------------- *\
      User language & translations for the static text.
  \* ------------------------------------------------------- */

  public lg = AppComponent.userLanguage;
  public txt = {
    'Sign in':            { en: 'Sign in', fr: 'Connexion' },
    with:                 { en: 'with', fr: 'avec' },
    Username:             { en: 'Username', fr: 'Pseudo' },
    'Username error':     { en: 'Invalid username.', fr: 'Pseudo invalide.' },
    'User not active':    { en: 'You should first validate your account by clicking on the link in the email we sent you.',
                            fr: 'Vous devez d\'abord valider votre compte en cliquant sur le lien dans le mail que nous vous avons envoyé.' },
    'User activated':     { en: 'Your account has already been activated. You may log in',
                            fr: 'Votre compte a déjà été activé. Vous pouvez vous connecter' },
    Password:             { en: 'Password', fr: 'Mot de passe' },
    'Password error':     { en: 'Invalid password.', fr: 'Mot de passe invalide.' },
    'Remember me':        { en: 'Remember me', fr: 'Rester connecté' },
    'Forgotten password': { en: 'Forgotten password?', fr: 'Mot de passe oublié ?' },
    Submit:               { en: 'Submit', fr: 'Envoyer' },
    'No account yet':     { en: 'Don\'t have an account?', fr: 'Pas encore de compte ?' },
    'Sign up':            { en: 'Sign up', fr: 'Inscription' },
    Welcome:              { en: 'Welcome to HyperTube. Your account has been activated ! You may now log in and enjoy.',
                            fr: 'Bienvenue dans HyperTube. Votre compte a été activé ! Vous pouvez maintenant vous connecter et profiter.'}
  };

  /* ------------------------------------------------------- *\
      Listeners for status changes.
  \* ------------------------------------------------------- */

  private authServiceWorkingSub: Subscription; // Tracks if auth.service is running/done.
  private accountStatusSub: Subscription; // Tracks .....
  private errorStatusSub: Subscription; // Gets any error from the API (back).

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

  ngOnInit(): void {
    // Listens to know when auth.service is ready (=when it's done running)
    // and then sets isLoading (=spinner) to FALSE.
    this.authServiceWorkingSub = this.authService.getAuthServiceWorkingListener()
      .subscribe(sub => { this.isLoading = false; });
    // ------>>>> same as signup

    // When the URL contains an id, triggers the service's activateAccount() function.
    if (this.route.snapshot.queryParams.id) {
      this.isLoading = true;
      this.accountStatusSub = this.authService.activateAccount(this.route.snapshot.queryParams.id).subscribe(
        success => {
          this.errorMessage = null;
          this.isLoading = false;
          this.successSignup = true;
        },
        error => {
          this.isLoading = false;
        }
      );
    }

    // When the URL contains a token, triggers the service's applySuccessSignin() function.
    if (this.route.snapshot.queryParams.token) {
      this.isLoading = true;
      this.authService.applyOmniauthSignin(this.route.snapshot.queryParams);
    }

    // Listens to errors from the signin API process.
    this.errorStatusSub = this.errorService.errorObs.subscribe(
      error => {
        if (error === 'User not found') {
          this.errorMessage = this.txt['Username error'][this.lg];
        } else if (error === 'User not active') {
          this.errorMessage = this.txt['User not active'][this.lg];
        } else if (error === 'User already activated') {
          this.errorMessage = this.txt['User activated'][this.lg];
        } else if (error === 'Wrong password') {
          this.errorMessage = this.txt['Password error'][this.lg];
        } else {
          // Might not be translated. Should be database errors
          this.errorMessage = error;
        }
        this.successSignup = false;
      }
    );
  }

  /* ------------------------------------------------------- *\
      Dealing with form submission.
  \* ------------------------------------------------------- */

  // When the form is submitted, if it's valid, sets the loading status
  // as true while authService.signin connects to the API (back) to
  // signin the user.
  onLogin() {
    if (this.signInForm.invalid) { return; }
    this.isLoading = true;
    this.authService.login(this.signInForm.value);
  }
  // ------>>>> compare with signup wording

  /* ------------------------------------------------------- *\
      End
  \* ------------------------------------------------------- */

  ngOnDestroy() {
    this.authServiceWorkingSub.unsubscribe();
    if (this.accountStatusSub) {
      this.accountStatusSub.unsubscribe();
    }
    this.errorStatusSub.unsubscribe();
  }
}

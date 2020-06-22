import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppComponent } from '../../app.component';
import { AuthService } from '../auth.service';
import { ErrorService } from 'src/app/error/error.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  /* ------------------------------------------------------- *\
      User language & translations for the static text.
  \* ------------------------------------------------------- */

  public lg = AppComponent.userLanguage;
  public txt = {
    'Forgotten password':     { en: 'Forgot password?', fr: 'Mot de passe oublié?' },
    Username:                 { en: 'Username', fr: 'Pseudo' },
    'Username error':         { en: 'Invalid username.', fr: 'Pseudo invalide.' },
    'Reset password':         { en: 'Reset password', fr: 'Réinitialiser le mot de passe' },
    'New password':           { en: 'New password', fr: 'Nouveau mot de passe' },
    Password:                 { en: 'Password', fr: 'Mot de passe' },
    'Password required':      { en: 'Password required.', fr: 'Le mot de passe est requis.' },
                                // tslint:disable-next-line: max-line-length
    'Password format':        { en: 'Your password must contain at least 8 characters, including 1 digit, 1 lowercase, 1 uppercase, and 1 special character.',
                                // tslint:disable-next-line: max-line-length
                                fr: 'Votre mot de passe doit contenir minimum 8 caractères, dont 1 chiffre, 1 minuscule, 1 majuscule, et 1 caractère spécial.' },
    'Password confirmation':  { en: 'Password confirmation', fr: 'Mot de passe (confirmation)' },
    'Passwords unmatch':      { en: 'Passwords do not match', fr: 'Les mots de passe no sont pas les mêmes' },
    'Save password':          { en: 'Save new password', fr: 'Sauve le nouveau mot de passe' },
    'reset success msg 1':    { en: 'Please check your email: we just sent you a link to choose your new password.',
                                // tslint:disable-next-line: max-line-length
                                fr: 'Vérifiez vos emails svp: nous venons de vous envoyer un lien pour définir votre nouveau mot de passe.' },
    'reset success msg 2':    { en: 'Your password has been successfully changed! You may now log in with your new password',
                                // tslint:disable-next-line: max-line-length
                                fr: 'Votre nouveau mot de passe a bien été enregistré! Vous pouvez maintenant vous connecter avec celui-ci.' },
    'Login link':             { en: 'Back to login page', fr: 'Retourner à la page de connexion' }
  };

  /* ------------------------------------------------------- *\
      Listeners for status changes.
  \* ------------------------------------------------------- */

  private authServiceWorkingSub: Subscription;
  private errorStatusSub: Subscription;

  /* ------------------------------------------------------- *\
      Public variables.
  \* ------------------------------------------------------- */

  public isLoading = false;
  public errorMessage: string;
  public successMessage: string;
  public secondForm = false;
  public activateLink = false;
  public displayForms = true;

  /* ------------------------------------------------------- *\
      U
  \* ------------------------------------------------------- */

  @ViewChild('f', { static: false }) forgotForm: NgForm;
  @ViewChild('f2', { static: false }) resetForm: NgForm;

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
      .subscribe(sub => {
        const resetMessageCode = this.authService.resetPasswordSuccessMessage;
        if (resetMessageCode !== 0) {
          this.errorMessage = null;
          this.successMessage = this.txt['reset success msg ' + resetMessageCode][this.lg];
        }
        if (this.successMessage === this.txt['reset success msg 2'][this.lg]) {
          this.displayForms = false;
        }
        this.isLoading = false;
        this.activateLink = true;
      });

    // When the URL contains an id and hash,
    // shows the second form to choose a new password
    // (default is first form to trigger a reset request based on username).
    if (this.route.snapshot.queryParams.id &&
        this.route.snapshot.queryParams.hash) {
      this.secondForm = true;
    }

    // Listens to ........
    this.errorStatusSub = this.errorService.errorObs.subscribe(
      error => {
        if (error === 'User not found') {
          this.errorMessage = this.txt['Username error'][this.lg];
        }
        this.successMessage = null;
      }
    );
  }

  /* ------------------------------------------------------- *\
      Dealing with form submission.
  \* ------------------------------------------------------- */

  // When the form is submitted, if it's valid, sets the loading status
  // as true while authService.forgotPassword connects to the API (back) to
  // generate a reset hash and set the user as active=false.
  onForgotPwd() {
    if (this.forgotForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.forgotPassword(this.forgotForm.value);
  }

  // When the form is submitted, if it's valid, sets the loading status
  // as true while authService.resetPassword connects to the API (back) to
  // ......
  onResetPwd() {
    if (this.resetForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.resetPassword(
      this.route.snapshot.queryParams.id,
      this.route.snapshot.queryParams.hash,
      this.resetForm.value
    );
  }

  samePwd(password1: string, password2: string): boolean {
    return password1 === password2;
  }

  /* ------------------------------------------------------- *\
      End
  \* ------------------------------------------------------- */

  ngOnDestroy() {
    this.authServiceWorkingSub.unsubscribe();
    this.errorStatusSub.unsubscribe();
  }
}

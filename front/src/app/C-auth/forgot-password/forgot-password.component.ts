import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AppComponent } from '../../app.component';
import { AuthService } from '../auth.service';
import { ErrorService } from 'src/app/error/error.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit
{
  /* ------------------------------------------------------- *\
      User language & translations for the static text.
  \* ------------------------------------------------------- */

  public lg = AppComponent.userLanguage;
  public txt = {
    'Forgotten password':     { en: 'Forgotten password', fr: 'Mot de passe oublié' },
    'Username':               { en: 'Username', fr: 'Pseudo' },
    'Username error':         { en: 'Invalid username.', fr: 'Pseudo invalide.' },
    'Reset password':         { en: 'Reset password', fr: 'Réinitialiser le mot de passe' },
    'New password':           { en: 'New password', fr: 'Nouveau mot de passe' },
    'Password':               { en: 'Password', fr: 'Mot de passe' },
    'Password required':      { en: 'Password required.', fr: 'Le mot de passe est requis.' },
    'Password format':        { en: 'Your password must contain at least 8 characters, including 1 digit, 1 lowercase, 1 uppercase, and 1 special character.',
                                fr: 'Votre mot de passe doit minimum 8 caractères, dont 1 chiffre, 1 minuscule, 1 majuscule, et 1 caractère spécial.' },
    'Password confirmation':  { en: 'Password confirmation', fr: 'Mot de passe (confirmation)' },
    'Save password':          { en: 'Save new password', fr: 'Sauve le nouveau mot de passe' }
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
  public resetStatus = false;
  public errorMessage: string;
  public successMessage: string;
  public secondForm = false;

  /* ------------------------------------------------------- *\
      U
  \* ------------------------------------------------------- */

  @ViewChild('f', { static: false }) forgotForm: NgForm;
  @ViewChild('f2', { static: false }) resetForm: NgForm;

  /* ------------------------------------------------------- *\
      Initialisation
  \* ------------------------------------------------------- */

  constructor(private http: HttpClient,
              private authService: AuthService,
              private errorService: ErrorService,
              private route: ActivatedRoute) {}

  ngOnInit(): void
  {
    // Listens to know when auth.service is ready (=when it's done running)
    // and then sets isLoading (=spinner) to FALSE.
    this.authServiceWorkingSub = this.authService.getAuthServiceWorkingListener()
      .subscribe(sub => { this.successMessage = this.authService.resetPasswordSuccessMessage;
                          this.isLoading = false; });

    this.errorStatusSub = this.errorService.errorObs.subscribe(error => {
      this.errorMessage = error;
    });

    if (
      this.route.snapshot.queryParams.id &&
      this.route.snapshot.queryParams.hash
    ) {
      this.secondForm = true;
    }
  }

  /* ------------------------------------------------------- *\
      Dealing with form submission.
  \* ------------------------------------------------------- */

  onForgotPwd()
  {
    if (this.forgotForm.invalid)
      return;
    this.isLoading = true;
    this.authService.forgotPassword(this.forgotForm.value);
  }

  onResetPwd()
  {
    if (this.resetForm.invalid)
      return;
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
}

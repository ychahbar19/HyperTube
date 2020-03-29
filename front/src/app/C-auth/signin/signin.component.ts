import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AppComponent } from '../../app.component';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { ErrorService } from 'src/app/error/error.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, OnDestroy
{
  // 1) Defines the translations for the static text.
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

  @ViewChild('f', { static: false }) signInForm: NgForm;
  response: Observable<any>;
  errorMessage: string;
  isLoading = false;
  successSignup = false;

  private authStatusSub: Subscription;
  private errorStatusSub: Subscription;
  private accountStatusSub: Subscription;

  constructor(private authService: AuthService,
              private errorService: ErrorService,
              private route: ActivatedRoute) {}

  ngOnInit(): void
  {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.errorStatusSub = this.errorService.errorObs.subscribe(
      error => {
        this.errorMessage = error;
      }
    );
    if (this.route.snapshot.queryParams.id) {
      this.isLoading = true;
      this.accountStatusSub = this.authService.activateAccount(this.route.snapshot.queryParams.id).subscribe(
        success => {
          this.isLoading = false;
          this.successSignup = true;
        }, error => {
          this.isLoading = false;
          this.errorMessage = error.error.message;
        }
      );
    }
  }

  onLogin()
  {
    if (this.signInForm.invalid)
      return;
    this.isLoading = true;
    this.authService.login(this.signInForm.value);
  }

  ngOnDestroy()
  {
    this.authStatusSub.unsubscribe();
    this.errorStatusSub.unsubscribe();
    if (this.accountStatusSub)
      this.accountStatusSub.unsubscribe();
  }
}

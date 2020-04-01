import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppComponent } from '../../app.component';
import { AuthService } from '../auth.service';
import { ErrorService } from '../../error/error.service';
import { FormAuthUserService } from '../../CD-form-auth-user/form-auth-user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy
{
  /* ------------------------------------------------------- *\
      User language & translations for the static text.
  \* ------------------------------------------------------- */

  public lg = AppComponent.userLanguage;
  public txt = {
    'Sign up':                { en: 'Sign up', fr: 'Inscription' },
    'with':                   { en: 'with', fr: 'avec' },
    'Creation success alert': { en: 'A confirmation email has been sent to your address. Please check it to activate your account.',
                                fr: 'Un email de confirmation vous a été envoyé. Veuillez le consulter pour activer votre compte.' },
    'First name':             { en: 'First name', fr: 'Prénom' },
    'Last name':              { en: 'Last name', fr: 'Nom' },
    'Name required':          { en: 'Full name is required.', fr: 'Le nom complet est requis.' },
    'Name format':            { en: 'Your name must be 2-30 characters long (letters and -,\'. only)',
                                fr: 'Votre nom doit contenir 2 à 30 caractères (lettres et -,\'. uniquement).' },
    'Username':               { en: 'Username', fr: 'Pseudo' },
    'Username required':      { en: 'Username is required.', fr: 'Le pseudo est requis.' },
    'Username format':        { en: 'Your username must be 4-20 characters long (letters and numbers only)',
                                fr: 'Votre pseudo doit contenir 4 à 20 caractères (lettres et chiffres uniquement).' },
    'Email':                  { en: 'Email', fr: 'Email' },
    'Email required':         { en: 'Email is required.', fr: 'L\'email est requis.' },
    'Email format':           { en: 'Please enter a valid email address.', fr: 'Veuillez entrer une adresse email valide.' },
    'Password':               { en: 'Password', fr: 'Mot de passe' },
    'Password required':      { en: 'Password required.', fr: 'Le mot de passe est requis.' },
    'Password format':        { en: 'Your password must contain at least 8 characters, including 1 digit, 1 lowercase, 1 uppercase, and 1 special character.',
                                fr: 'Votre mot de passe doit minimum 8 caractères, dont 1 chiffre, 1 minuscule, 1 majuscule, et 1 caractère spécial.' },
    'Password confirmation':  { en: 'Password confirmation', fr: 'Mot de passe (confirmation)' },
    'Submit':                 { en: 'Submit', fr: 'Envoyer' },
    'Have account':           { en: 'Already have an account?', fr: 'Déjà inscrit ?' },
    'Sign in':                { en: 'Sign in', fr: 'Connexion' }
  };

  /* ------------------------------------------------------- *\
      Listeners for status changes. 
  \* ------------------------------------------------------- */

  private authServiceWorkingSub: Subscription; //Tracks if auth.service is running/done.
  private signupSuccessSub: Subscription; //Tracks if the signup process is a success.
  private errorStatusSub: Subscription; //
  
  /* ------------------------------------------------------- *\
      Public variables.
  \* ------------------------------------------------------- */

  public isLoading = false; //Used to show the spinner during execution times.
  public form: FormGroup; //Contains the signup form.
  public avatarPreview: string; //Preview of the uploaded avatar.
  public signupSuccess = false; //Used to hide/show the 'successful signup' message.
  public errorMessage: string;

  /* ------------------------------------------------------- *\
      Initialisation
  \* ------------------------------------------------------- */

  constructor(private authService: AuthService,
              private errorService: ErrorService,
              private formAuthUserService: FormAuthUserService) {}

  ngOnInit(): void
  {
    // Creates the form with all the necessary validation rules.
    this.form = this.formAuthUserService.defineValidFormGroup('signup');

    // Listens to know when auth.service is ready (=when it's done running)
    // and then sets isLoading (=spinner) to FALSE.
    this.authServiceWorkingSub = this.authService.getAuthServiceWorkingListener()
      .subscribe(sub => { this.isLoading = false; }
    );

    // Listens to know when a signup is successful,
    // and then sets signupSuccess and errorMessage appropriately.
    this.signupSuccessSub = this.authService.getSignupSuccessListener()
      .subscribe(sub => { this.signupSuccess = true;
                          this.errorMessage = null; });

    // Listens to ........
    this.errorStatusSub = this.errorService.errorObs.subscribe(
      error => { this.errorMessage = error; }
    );
  }

  /* ------------------------------------------------------- *\
      Dealing with input/form submission.
  \* ------------------------------------------------------- */

  // When a file (=avatar) is uploaded, add its info to the
  // form object, and reads it to output the avatar preview.
  onAvatarPicked(event: Event)
  {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ avatar: file });
    this.form.get('avatar').updateValueAndValidity(); //Recalculates the value and validation status of the control.
    
    const reader = new FileReader();
    reader.onload = () => { this.avatarPreview = reader.result as string; };
    reader.readAsDataURL(file);
  }

  // When the form is updated, if it's valid, sets the loading status
  // as true while authService.signup connects to the API (back) to
  // signup the user.
  onSignup()
  {
    if (this.form.invalid)
      return;
    this.isLoading = true;
    this.authService.signup(this.form.value);
  }

  /* ------------------------------------------------------- *\
      End
  \* ------------------------------------------------------- */

  ngOnDestroy()
  {
    this.authServiceWorkingSub.unsubscribe();
    this.signupSuccessSub.unsubscribe();
    this.errorStatusSub.unsubscribe();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { mimeType } from './mime-type.validator';
import { AuthService } from '../auth.service';
import { ErrorService } from '../../error/error.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../signin/signin.component.scss', './signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy
{
  // 1) Defines the translations for the static text.
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
    'Email':                  { en: 'Email (example@mail.com)', fr: 'Email (exemple@mail.com)' },
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
  public lg = 'fr';

  public form: FormGroup;
  public avatarPreview: string;
  public errorMessage: string;
  public isLoading = false;
  public creationStatus = false;

  private authStatusSub: Subscription;
  private errorStatusSub: Subscription;
  private creationStatusSub: Subscription;

  constructor(private authService: AuthService,
              private errorService: ErrorService) {}

  // 2) Defines and handles the form's validation.
  ngOnInit(): void
  {
    // Defines and applies form validation rules.
    const validNamePattern = "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,30}$";
    const validUsernamePattern = '^[a-zA-Z0-9]{4,20}$';
    const validEmailPattern = '^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$';
    const validpasswordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[&@#!?,;.:+=*\-\/\\_$£<>%])[a-zA-Z0-9&@#!?,;.:+=*\-\/\\_$£<>%]{8,}$';
    this.form = new FormGroup(
      {
        avatar: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }),
        firstName: new FormControl(null, { validators: [Validators.required, Validators.pattern(validNamePattern)]}),
        lastName: new FormControl(null, { validators: [Validators.required, Validators.pattern(validNamePattern)]}),
        username: new FormControl(null, { validators: [Validators.required, Validators.pattern(validUsernamePattern)]}),
        email: new FormControl(null, { validators: [Validators.required, Validators.pattern(validEmailPattern)]}),
        password: new FormControl(null, { validators: [Validators.required, Validators.pattern(validpasswordPattern)]}),
        confirmPassword: new FormControl(null, { validators: [Validators.required, Validators.pattern(validpasswordPattern)]})
      });

    // Listens to ........
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );

    // Listens to ........
    this.errorStatusSub = this.errorService.errorObs.subscribe(
      error => {
        this.errorMessage = error;
      }
    );

    // Listens to ........
    this.creationStatusSub = this.authService.getCreationStatusListener().subscribe(
      creationStatus => {
        this.creationStatus = true;
        this.errorMessage = null;
      }
    );
  }

  // 3) 
  onAvatarPicked(event: Event)
  {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ avatar: file });
    this.form.get('avatar').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // 4) 
  onSignup()
  {
    if (this.form.invalid)
      return;
    this.isLoading = true;
    this.authService.createUser(this.form.value);
  }

  ngOnDestroy() { this.authStatusSub.unsubscribe(); this.errorStatusSub.unsubscribe(); }
}

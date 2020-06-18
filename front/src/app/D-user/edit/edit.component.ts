import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppComponent } from '../../app.component';
import { AuthService } from '../../C-auth/auth.service';
import { FormAuthUserService } from 'src/app/CD-form-auth-user/form-auth-user.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  /* ------------------------------------------------------- *\
      User language & translations for the static text.
  \* ------------------------------------------------------- */

  public lg = AppComponent.userLanguage;
  public txt = {
    'Edit profile':           { en: 'Edit profile', fr: 'Modifier mon profil' },
    'First name':             { en: 'First name', fr: 'Prénom' },
    'Last name':              { en: 'Last name', fr: 'Nom' },
    'Name required':          { en: 'Full name is required.', fr: 'Le nom complet est requis.' },
    'Name format':            { en: 'Your name must be 2-30 characters long (letters and -,\'. only)',
                                fr: 'Votre nom doit contenir 2 à 30 caractères (lettres et -,\'. uniquement).' },
    Username:                 { en: 'Username', fr: 'Pseudo' },
    'Username required':      { en: 'Username is required.', fr: 'Le pseudo est requis.' },
    'Username format':        { en: 'Your username must be 4-20 characters long (letters and numbers only)',
                                fr: 'Votre pseudo doit contenir 4 à 20 caractères (lettres et chiffres uniquement).' },
    Email:                    { en: 'Email (example@mail.com)', fr: 'Email (exemple@mail.com)' },
    'Email required':         { en: 'Email is required.', fr: 'L\'email est requis.' },
    'Email format':           { en: 'Please enter a valid email address.', fr: 'Veuillez entrer une adresse email valide.' },
    Password:                 { en: 'New password', fr: 'Nouveau mot de passe' },
    'Password format':        { en: 'Your password must contain at least 8 characters, including 1 digit, 1 lowercase, 1 uppercase, and 1 special character.',
                                fr: 'Votre mot de passe doit minimum 8 caractères, dont 1 chiffre, 1 minuscule, 1 majuscule, et 1 caractère spécial.' },
    'Password confirmation':  { en: 'New password confirmation', fr: 'Nouveau mot de passe (confirmation)' },
    Submit:                   { en: 'Submit', fr: 'Envoyer' },
    Success:                  { en: 'Profile updated successfully !', fr: 'Le profile a été correctement mis a jour !'},
    Error:                    { en: 'Oops an error has occured ! Please try again',
                                fr: 'Oups une erreur est survenue ! Merci de bien vouloir réessayer' }
  };

  /* ------------------------------------------------------- *\
      Listeners for status changes.
  \* ------------------------------------------------------- */

  private errorStatusSub: Subscription;

  /* ------------------------------------------------------- *\
      Public variables.
  \* ------------------------------------------------------- */

  public isLoading = true;
  public form: FormGroup;
  public avatarPreview: string;
  public errorMessage: boolean;
  public successMessage: boolean;
  public user: object;
  public userData: any;

  /* ------------------------------------------------------- *\
      Initialisation
  \* ------------------------------------------------------- */

  constructor(private authService: AuthService,
              private http: HttpClient,
              private formAuthUserService: FormAuthUserService) {}

  // 2) Defines and handles the form's validation.
  ngOnInit(): void {
    // Defines and applies form validation rules.
    this.form = this.formAuthUserService.defineValidFormGroup('edit');

    this.http.get('http://localhost:3000/api/user/editProfile')
      .subscribe(response => {
        this.userData = response;
        this.form.patchValue(
        {
          firstName: this.userData.firstName,
          lastName: this.userData.lastName,
          username: this.userData.username,
          email: this.userData.email
        });
        this.avatarPreview = this.userData.avatar;
        this.isLoading = false;
      },
      error => {
        this.errorMessage = true;
      });
    this.errorStatusSub = this.authService.getAuthServiceWorkingListener().subscribe(response => {
      this.successMessage = true;
      this.errorMessage = false;
    }, error => {
      this.successMessage = false;
      this.errorMessage = true;
    });
  }

  // 3)
  /*
  Same as signup, combine if possible
  */
  onAvatarPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ avatar: file });
    this.form.get('avatar').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => { this.avatarPreview = reader.result as string; };
    reader.readAsDataURL(file);
  }

  usernameStatus(){
   this.form.get('username').updateValueAndValidity();
  }

  /* ------------------------------------------------------- *\
      Dealing with input/form submission.
  \* ------------------------------------------------------- */

  onEdit() {
    if (this.form.invalid) { return; }
    this.isLoading = true;
    this.authService.updateUser(this.form.value);
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.errorStatusSub.unsubscribe();
  }
}

import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../mime-type.validator';

@Injectable({ providedIn: 'root' })
export class FormAuthUserService {
  /* ------------------------------------------------------------- *\
    1) Private variables and functions to support
      defineValidFormGroup() below.
  \* ------------------------------------------------------------- */

  private form = new FormGroup({});

  private validPatterns = {
    language: '^(en|fr)$',
    name: '^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.\'-]{2,30}$',
    username: '^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.\'-]{2,30}$',
    email: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)+$',
    password: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[&@#!?,;.:+=*\-\/\\_$£<>%])[a-zA-Z0-9&@#!?,;.:+=*\-\/\\_$£<>%]{8,}$',
  };
  private addAvatar() {
    this.form.addControl('avatar', new FormControl(null,
      {
        validators: [Validators.required], asyncValidators: [mimeType]
      }));
  }
  private addAvatarEdit() {
    this.form.addControl('avatar', new FormControl(null,
      {
        validators: [], asyncValidators: [mimeType]
      }));
  }
  private addLanguage() {
    this.form.addControl('language', new FormControl(null,
      {
        validators: [Validators.required, Validators.pattern(this.validPatterns.language)]
      }));
  }
  // Common for firstName and lastName
  private addName(whichName)  {
    this.form.addControl(whichName, new FormControl(null,
      {
        validators: [Validators.required, Validators.pattern(this.validPatterns.name)]
      }));
  }
  private addUsername() {
    this.form.addControl('username', new FormControl(null,
      {
        validators: [Validators.required, Validators.pattern(this.validPatterns.username)]
      }));
  }
  private addEmail() {
    this.form.addControl('email', new FormControl(null,
      {
        validators: [Validators.required, Validators.pattern(this.validPatterns.email)]
      }));
  }
  // Common for password and confirmPassword (required for signup, optional for edit)
  private addPassword(whichPassword) {
    this.form.addControl(whichPassword, new FormControl(null, {
        validators: [Validators.required, Validators.pattern(this.validPatterns.password)]
      }));
  }

  /* ------------------------------------------------------------- *\
    2) Public function defineValidFormGroup(scope).
      This function is called by components that require a
      user form validation. It creates and returns a FormGroup with:
      - the fields expected by the given scope,
      - validation rules applied to those fileds.
  \* ------------------------------------------------------------- */

  defineValidFormGroup(scope: string)
  {
    if (scope === 'signup' || scope === 'edit')
    {
      this.addName('firstName');
      this.addName('lastName');
      this.addUsername();
      this.addEmail();
      this.addPassword('password');
      this.addPassword('confirmPassword');
      if (scope === 'signup')
      {
        this.addAvatar();
      }
      else if (scope === 'edit')
      {
        this.addAvatarEdit();
        this.addLanguage();
      }
    }
    if (scope === 'signin')
    {
      this.addUsername();
      this.addPassword('password');
    }
    /*
    forgotten pw
    */
    return this.form;
  }
}

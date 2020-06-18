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
    name: '^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.\'-]{2,30}$',
    username: '^[a-zA-Z0-9]{4,20}$',
    email: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)+$',
    password: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[&@#!?,;.:+=*\-\/\\_$£<>%])[a-zA-Z0-9&@#!?,;.:+=*\-\/\\_$£<>%]{8,}$',
  };

  private addAvatar() {
    this.form.addControl('avatar', new FormControl(null,
      {
        validators: [], asyncValidators: [mimeType]
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

  // Common for password and confirmPassword
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

  defineValidFormGroup(scope: string) {
    if (scope === 'signup') {
      this.addAvatar();
      this.addName('firstName');
      this.addName('lastName');
      this.addUsername();
      this.addEmail();
      this.addPassword('password');
      this.addPassword('confirmPassword');
    } else if (scope === 'signin') {
      this.addUsername();
      this.addPassword('password');
    } else if (scope === 'edit') {
      this.addAvatar();
      this.addName('firstName');
      this.addName('lastName');
      this.addUsername();
      this.addEmail();
    }
    /*
    forgotten pw
    */
    return this.form;
  }
}

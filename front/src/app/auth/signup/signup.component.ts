import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { mimeType } from './mime-type.validator';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../signin/signin.component.scss', './signup.component.scss']
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  avatarPreview: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'avatar': new FormControl(
        null, {
          validators: [Validators.required],
          asyncValidators: [mimeType]
        }),
      'firstName': new FormControl(
        null, {
        validators: [
          Validators.required,
          Validators.pattern('[a-zA-Z]+$')
        ]}),
      'lastName': new FormControl(
        null, {
        validators: [
          Validators.required,
          Validators.pattern('[a-zA-Z]+$')
        ]}),
      'username': new FormControl(
        null, {
        validators: [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9]{6,33}$')
        ]}),
      'email': new FormControl(
        null, {
        validators: [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$')
        ]}),
      'password': new FormControl(
        null, {
        validators: [
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,33}$')
        ]}),
      'confirmPassword': new FormControl(
        null, {
        validators: [
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,33}$')
        ]})
      });
  }

  onSignup() {
    if (this.form.invalid) {
      return;
    }
    this.authService.createUser(this.form.value);
  }

  onAvatarPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ avatar: file });
    this.form.get('avatar').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  samePwd(password1, password2) {
    return password1 === password2;
  }
}

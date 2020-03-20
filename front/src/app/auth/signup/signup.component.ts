import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { mimeType } from './mime-type.validator';

import { AuthService } from '../auth.service';
import { ErrorService } from 'src/app/error/error.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../signin/signin.component.scss', './signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  private errorStatusSub: Subscription;
  private creationStatusSub: Subscription;
  form: FormGroup;
  avatarPreview: string;
  errorMessage: string;
  isLoading = false;
  creationStatus = false;

  constructor(private authService: AuthService, private errorService: ErrorService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      avatar: new FormControl(
        null, {
          validators: [Validators.required],
          asyncValidators: [mimeType]
        }),
      firstName: new FormControl(
        null, {
          validators: [
            Validators.required,
            Validators.pattern('[a-zA-Z]+$')
          ]}),
      lastName: new FormControl(
        null, {
          validators: [
            Validators.required,
            Validators.pattern('[a-zA-Z]+$')
          ]}),
      username: new FormControl(
        null, {
          validators: [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9]{6,33}$')
          ]}),
      email: new FormControl(
        null, {
          validators: [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$')
          ]}),
      password: new FormControl(
        null, {
          validators: [
            Validators.required,
            Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,33}$')
          ]}),
      confirmPassword: new FormControl(
        null, {
          validators: [
            Validators.required,
            Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,33}$')
          ]})
      });
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
    this.creationStatusSub = this.authService.getCreationStatusListener().subscribe(
      creationStatus => {
        this.creationStatus = true;
        this.errorMessage = null;
      }
    );
  }

  onSignup() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
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

  samePwd(password1: string, password2: string): boolean {
    return password1 === password2;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.errorStatusSub.unsubscribe();
  }
}

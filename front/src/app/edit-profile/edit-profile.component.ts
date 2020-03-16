import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { mimeType } from './mime-type.validator';

import { ErrorService } from 'src/app/error/error.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['../auth/signin/signin.component.scss', './edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {

  form: FormGroup;
  avatarPreview: string | File;
  errorMessage: string;
  isLoading = false;
  private errorStatusSub: Subscription;
  user: Object;
  userData: any;

  constructor(private http: HttpClient, private errorService: ErrorService) { }

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
            Validators.pattern('[a-zA-Z]+$')
          ]}),
      lastName: new FormControl(
        null, {
          validators: [
            Validators.pattern('[a-zA-Z]+$')
          ]}),
      username: new FormControl(
        null, {
          validators: [
            Validators.pattern('^[a-zA-Z0-9]{6,33}$')
          ]}),
      email: new FormControl(
        null, {
          validators: [
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
    this.errorStatusSub = this.errorService.errorObs.subscribe(
      error => {
        this.errorMessage = error;
      }
    );

    this.http.get('http://localhost:3000/editProfile')
    .subscribe(response => {
        this.userData = response;
        this.form.patchValue({
          firstName: this.userData.firstName,
          lastName: this.userData.lastName,
          username: this.userData.username,
          email: this.userData.email,
        });
        this.avatarPreview = this.userData.avatar;
    }, error => {
    });
    console.log(this.form);
  }

  onEdit() {
    if (this.form.invalid) {
      return;
    }
    const userData = new FormData();
    userData.append('photoUrl', this.form.value.avatar);
    userData.append('firstName', this.form.value.firstName);
    userData.append('lastName', this.form.value.lastName);
    userData.append('username', this.form.value.username);
    userData.append('email', this.form.value.email);
    userData.append('password', this.form.value.password);
    userData.append('confirmPassword', this.form.value.confirmPassword);
    this.http.post('http://localhost:3000/editProfile', userData)
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error);
      });
    this.isLoading = true;
  }

  onAvatarPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    // console.log(file);
    
    this.form.patchValue({ avatar: file });
    this.form.get('avatar').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
    };
    
    reader.readAsArrayBuffer(file);
  }

  samePwd(password1: string, password2: string): boolean {
    return password1 === password2;
  }

  ngOnDestroy() {
    this.errorStatusSub.unsubscribe();
  }

}

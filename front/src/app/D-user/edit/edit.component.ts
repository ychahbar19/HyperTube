import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../C-auth/auth.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: [/*'../C-auth/signin/signin.component.scss', */'./edit.component.scss']
})
export class EditComponent implements OnInit {
  form: FormGroup;
  avatarPreview: string | File;
  errorMessage: string;
  isLoading = false;
  private errorStatusSub: Subscription;
  user: Object;
  userData: any;

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      avatar: new FormControl(
        null, {
          asyncValidators: []
        }),
      firstName: new FormControl(
        null, {
          validators: [
            Validators.pattern('[a-zA-Z]+$'),
            Validators.required
          ]}),
      lastName: new FormControl(
        null, {
          validators: [
            Validators.pattern('[a-zA-Z]+$'),
            Validators.required
          ]}),
      username: new FormControl(
        null, {
          validators: [
            Validators.pattern('^[a-zA-Z0-9]{6,33}$'),
            Validators.required
          ]}),
      email: new FormControl(
        null, {
          validators: [
            Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$'),
            Validators.required
          ]})
      });
      this.http.get('http://localhost:3000/api/user/editProfile')
    .subscribe(response => {
        this.userData = response;
        this.form.patchValue({
          firstName: this.userData.firstName,
          lastName: this.userData.lastName,
          username: this.userData.username,
          email: this.userData.email
        });
        this.avatarPreview = this.userData.avatar;
    }, error => {
      // a voir apres le merge
    });
  }

  onEdit(){
    if (this.form.invalid) {
      return;
    }
    // this.isLoading = true;
    this.authService.updateUser(this.form.value);
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
}

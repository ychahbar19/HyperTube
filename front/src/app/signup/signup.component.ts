import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../signin/signin.component.scss', './signup.component.scss']
})
export class SignupComponent implements OnInit {
  @ViewChild('f', { static: false }) signUpForm: NgForm;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit() {
   const userData = {
     imageURL: this.signUpForm.value.avatar,
     firstname: this.signUpForm.value.firstname,
     name: this.signUpForm.value.name,
     username: this.signUpForm.value.username,
     email: this.signUpForm.value.email,
     password: this.signUpForm.value.checkPasswds.password,
     confirmPassword: this.signUpForm.value.checkPasswds.confirmPassword
   };

   this.authService.signUp(userData);
  }

  log(f){
    console.log(f);

  }

  samePwd(password1, password2) {
    return password1 === password2;
  }
}

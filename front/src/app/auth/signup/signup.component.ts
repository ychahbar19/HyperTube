import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

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

  onSignup() {
    if (this.signUpForm.invalid) {
      return;
    }
    this.authService.createUser(this.signUpForm.value);
  }

  samePwd(password1, password2) {
    return password1 === password2;
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: [
    './forgot-password.component.scss',
    '../signin/signin.component.scss'
  ]
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild('f', { static: false }) forgotForm: NgForm;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onForgotPwd() {
    if (this.forgotForm.invalid) {
      return;
    }
    this.authService.forgotPassword(this.forgotForm.value);
  }
}

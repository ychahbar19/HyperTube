import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  @ViewChild('f2', { static: false }) resetForm: NgForm;
  private errorStatusSub: Subscription;
  private authStatusSub: Subscription;
  resetStatus = false;
  errorMessage: string;
  successMessage: string;
  isLoading = false;
  secondForm = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorService: ErrorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.successMessage = this.authService.resetPasswordSuccessMessage;
        this.isLoading = false;
      });
    this.errorStatusSub = this.errorService.errorObs.subscribe(error => {
      this.errorMessage = error;
      this.successMessage = null;
    });
    if (
      this.route.snapshot.queryParams.id &&
      this.route.snapshot.queryParams.hash
    ) {
      this.secondForm = true;
    }
  }

  onForgotPwd() {
    if (this.forgotForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.forgotPassword(this.forgotForm.value);
  }

  onResetPwd() {
    if (this.resetForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.resetPassword(
      this.route.snapshot.queryParams.id,
      this.route.snapshot.queryParams.hash,
      this.resetForm.value
    );
  }

  samePwd(password1: string, password2: string): boolean {
    return password1 === password2;
  }
}

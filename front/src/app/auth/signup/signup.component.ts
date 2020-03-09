import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../signin/signin.component.scss', './signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) signUpForm: NgForm;
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignup() {
    if (this.signUpForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(this.signUpForm.value);
  }

  samePwd(password1: string, password2: string) {
    return password1 === password2;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}

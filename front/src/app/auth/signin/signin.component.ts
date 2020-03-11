import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { ErrorService } from 'src/app/error/error.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) signInForm: NgForm;
  response: Observable<any>;
  errorMessage: string;
  isLoading = false;
  successSignup = false;
  private authStatusSub: Subscription;
  private errorStatusSub: Subscription;

  constructor(private authService: AuthService, private errorService: ErrorService, private route: ActivatedRoute) { }

  ngOnInit(): void {
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
    if (this.route.snapshot.queryParams.id) {
      this.authService.activateAccount(this.route.snapshot.queryParams.id);
      this.successSignup = true;
      // console.log(this.route.snapshot.queryParams);
    }
  }

  onLogin() {
    if (this.signInForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(this.signInForm.value);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.errorStatusSub.unsubscribe();
  }
}

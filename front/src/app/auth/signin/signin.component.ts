import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) signInForm: NgForm;
  response: Observable<any>;
  errors = [];
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
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
  }
}

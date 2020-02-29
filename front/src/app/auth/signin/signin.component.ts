import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  @ViewChild('f', { static: false }) signInForm: NgForm;
  response: Observable<any>;
  errors = [];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const userData = {
      username: this.signInForm.value.username,
      password: this.signInForm.value.password
    };
    this.response = this.authService.signIn(userData);
    this.response.subscribe(
      (user) => {
        localStorage.setItem('userId', user.id.toString());
        this.router.navigate(['/gallery']);
      },
      (error) => {
        this.errors = error.error;
        // GERER L'ERREUR EN CONSOLE !!!!
      }
    );
  }
}

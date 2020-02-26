import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  @ViewChild('f', { static: false }) signInForm: NgForm;
  error = '';

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log(params);
      this.error = 'Wrong username and/or password';
    });
  }

  onSubmit() {
    const userData = {
      username: this.signInForm.value.username,
      password: this.signInForm.value.password
    };
    this.authService.signIn(userData);
  }
}

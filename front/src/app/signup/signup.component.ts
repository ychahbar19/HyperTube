/*
SIGNUP (guests only)
Content:
  Form with:
  - email           (check: valid email format, available)
  - username        (check: valid string, available)
  - pic             (check: valid jpg/jpeg/png/gif)
  - last_name       (check: valid string)
  - first_name      (check: valid string)
  - secure password (check: at least 6 chars, 1[AZaz], 1[09], 1 special char)
  (- preferred language: default = EN)
*/

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../signin/signin.component.scss', './signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {
    console.log(f);
  }

  samePwd(password1, password2) {
    return password1 === password2;
  }

  log(input) {
    console.log(input);
  }
}

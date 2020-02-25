/*
SIGNIN (guests only)
Content:
  - Form with:
    - username  (check: valid string, in database)
    - password  (check: matches hash in database)
  - Omniauth:
    - 42
    - Google/Facebook/Twitter... (at least 1, more = bonus)
*/

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {
    console.log(f);
  }

  log(username)
  {
    console.log(username);
  }
}

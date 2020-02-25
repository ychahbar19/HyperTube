/*
HEADER
Content (= nav links):
- If guest: Home (= logo), register, login
- If member: Gallery (= logo), my profile, logout
- Both: language selector
*/

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{

  isLogged = false;

  constructor(private router: Router) {
  }

  displaySignInButton(){
    return (this.router.url !== '/signin' || this.isLogged);
  }
}

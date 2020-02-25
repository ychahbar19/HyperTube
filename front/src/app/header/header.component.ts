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

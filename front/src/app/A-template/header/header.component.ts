import { Component, OnInit, OnDestroy } from '@angular/core';
//import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../C-auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy
{
  // 1) Defines the translations for the static text.
  public txt = {
    'My profile': { en: 'My profile', fr: 'Mon profil' },
    'Settings':   { en: 'Settings', fr: 'Paramètres' },
    'Log out':    { en: 'Log out', fr: 'Déconnexion' }
  };
  public lg = 'fr';

  public userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  
  constructor(private authService: AuthService/*,
              private router: Router*/) {}

  // 2) Defines whether the user is authenticated or not
  // (to output the right navigation links).
  ngOnInit()
  {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
                              .subscribe(isAuthenticated =>
                              {
                                this.userIsAuthenticated = isAuthenticated;
                              });
  }
  /* displaySignInButton() { return (this.router.url !== '/signin' && !this.userIsAuthenticated); }
  --> replace with appropriate active status on signin/up? */

  // 3) Calls logout() from /C-auth/auth.service (onclick 'logout' nav link).
  onLogout()
  {
    this.authService.logout();
  }

  ngOnDestroy() { this.authListenerSubs.unsubscribe(); }
}

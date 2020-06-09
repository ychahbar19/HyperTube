import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../../app.component';
// import { Router } from '@angular/router';
import { AuthService } from '../../C-auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  /* ------------------------------------------------------- *\
      User language & translations for the static text.
  \* ------------------------------------------------------- */

  public lg = AppComponent.userLanguage;
  public txt = {
    'My profile': { en: 'My profile', fr: 'Mon profil' },
    Settings:     { en: 'Settings', fr: 'Paramètres' },
    'Log out':    { en: 'Log out', fr: 'Déconnexion' }
  };

  /* ------------------------------------------------------- *\
      Variables
  \* ------------------------------------------------------- */

  public userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  /* ------------------------------------------------------- *\
      Initialisation
  \* ------------------------------------------------------- */

  constructor(private authService: AuthService/*,
              private router: Router*/) {}

  // 2) Defines whether the user is authenticated or not
  // (to output the right navigation links).
  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthServiceWorkingListener()
                              .subscribe(isAuthenticated => {
                                this.userIsAuthenticated = isAuthenticated;
                              });
  }
  /* displaySignInButton() { return (this.router.url !== '/signin' && !this.userIsAuthenticated); }
  --> replace with appropriate active status on signin/up? */

  // 3)
  onLogout() {
    this.authService.logout();
  }

  // 4)
  onLanguageChange(userLanguage) {
    localStorage.setItem('userLanguage', userLanguage);
    window.location.reload();
  }

  ngOnDestroy() { this.authListenerSubs.unsubscribe(); }
}

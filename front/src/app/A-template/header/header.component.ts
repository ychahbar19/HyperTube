import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../../app.component';
// import { Router } from '@angular/router';
import { AuthService } from '../../C-auth/auth.service';
import { UserService } from 'src/app/D-user/user.service';
import { User } from '../../shared/UserInterface';

@Component({
  selector: 'app-header',
  providers: [UserService],
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

  public user: User;
  public userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  /* ------------------------------------------------------- *\
      Initialisation
  \* ------------------------------------------------------- */

  constructor(private authService: AuthService, private userService: UserService) {}

  // 2) Defines whether the user is authenticated or not
  // (to output the right navigation links).
  async ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthServiceWorkingListener()
                              .subscribe(async isAuthenticated => {
                                this.userIsAuthenticated = isAuthenticated;
                                if (this.userIsAuthenticated) {
                                  this.user = await this.userService.getUserInfo(undefined);
                                }
                              });
    if (this.userIsAuthenticated) {
      this.user = await this.userService.getUserInfo(undefined);
    }
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

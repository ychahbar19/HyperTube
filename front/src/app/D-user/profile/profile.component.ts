import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { AuthService } from '../../C-auth/auth.service';

import { User } from '../../shared/UserInterface';

@Component({
  selector: 'app-profile',
  providers: [UserService],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private userId: string;
  private user: User;

  public profile: User;
  public ownProfile: boolean;
  public isLoading = true;

  // 1) Defines the translations for the static text.
  public lg = AppComponent.userLanguage;
  public txt = {
    Edit: { en: 'Edit my profile', fr: 'Editer mon profil' },
  };

  // 2) Defines the variable userId by taking the value in the URL.
  constructor(private userService: UserService,
              private authService: AuthService,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.userId = params['user_id'];
    });
  }

  // 3) Calls getUserInfo() (in user.service.ts) to fetch the user's info
  // from the API (back), and saves them in the array 'profile' for output
  // in profile.component.html.
  async ngOnInit() {
    this.profile = await this.userService.getUserInfo(this.userId);
    this.user = await this.userService.getUserInfo('');

    this.ownProfile = (this.profile.user_id === this.user.user_id) ? true : false;
    // if (this.userId === undefined || this.userId == /* active user id*/ )
    this.isLoading = false;
  }
}

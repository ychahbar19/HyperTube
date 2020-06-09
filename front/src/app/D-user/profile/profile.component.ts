import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  providers: [UserService],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private user_id;

  public profile = {};
  public profileComments = [];
  public showEdit = false;

  // 1) Defines the translations for the static text.
  public lg = AppComponent.userLanguage;
  public txt = {
    Edit: { en: 'Edit my profile', fr: 'Editer mon profil' },
  };

  // 2) Defines the variable user_id by taking the value in the URL.
  constructor(private userService: UserService,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.user_id = params['user_id'];
    });
  }

  // 3) Calls getUserInfo() (in user.service.ts) to fetch the user's info
  // from the API (back), and saves them in the array 'profile' for output
  // in profile.component.html.
  async ngOnInit() {
    this.profile = await this.userService.getUserInfo(this.user_id);
    // if (this.user_id === undefined || this.user_id == /* active user id*/ )
      this.showEdit = true;
  }
}

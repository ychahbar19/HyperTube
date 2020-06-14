import { Component, OnInit } from '@angular/core';
import { AuthService } from './C-auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public static userLanguage: string;

  // 1) Defines the user language. This is inherited by all other
  // components to show the content in the right language.
  constructor(private authService: AuthService) {
    if (localStorage.getItem('userLanguage') === null) {
      localStorage.setItem('userLanguage', 'en');
    }
    AppComponent.userLanguage = localStorage.getItem('userLanguage');
  }

  // 2)
  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
}

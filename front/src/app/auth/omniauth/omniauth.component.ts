import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-omniauth',
  templateUrl: './omniauth.component.html',
  styleUrls: ['./omniauth.component.scss']
})
export class OmniauthComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onProviderClicked(provider: string) {
    this.authService.loginWithProvider(provider);
  }

}

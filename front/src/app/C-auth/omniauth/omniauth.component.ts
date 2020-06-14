import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-omniauth',
  templateUrl: './omniauth.component.html',
  styleUrls: ['./omniauth.component.scss']
})
export class OmniauthComponent {
  // 1) Defines the translations for the static text.
  public lg = AppComponent.userLanguage;
  public txt = {
    'Use account': { en: 'Or with...', fr: 'Ou avec...' }
  };

  constructor() { }
}

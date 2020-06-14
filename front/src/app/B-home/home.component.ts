import { Component } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // 1) Defines the translations for the static text.
  public lg = AppComponent.userLanguage;
  public txt = {
    Watch:          { en: 'Watch your favourite movies', fr: 'Regardez vos films préférés' },
    'on streaming': { en: 'with HyperTube streaming', fr: 'en streaming sur HyperTube' },
    'Log in':       { en: 'Log in', fr: 'Connexion' },
    'Sign up':      { en: 'Sign up', fr: 'Inscription' }
  };

  constructor() {}
}

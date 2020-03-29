import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent
{
  // 1) Defines the translations for the static text.
  public txt = {
    'Watch':        { en: 'Watch your favourite movies', fr: 'Regardez vos films préférés' },
    'on streaming': { en: 'with HyperTube streaming', fr: 'en streaming sur HyperTube' },
    'Log in':       { en: 'Log in', fr: 'Connexion' },
    'Sign up':      { en: 'Sign up', fr: 'Inscription' }
  };
  public lg = 'fr';

  constructor() {}
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-omniauth',
  templateUrl: './omniauth.component.html',
  styleUrls: ['./omniauth.component.scss']
})
export class OmniauthComponent
{
  // 1) Defines the translations for the static text.
  public txt = {
    'Use account': { en: 'Or with...', fr: 'Ou avec...' }
  };
  public lg = 'fr';
  
  constructor() { }
}

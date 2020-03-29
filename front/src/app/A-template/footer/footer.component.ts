import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent
{
  // Defines the translations for the copyright.
  public txt = {
    'Created by':
      {
        en: 'Created by cbrichau, aceciora, asouat and ychahbar from 19CodingSchool (42 Network)',
        fr: 'Créé par cbrichau, aceciora, asouat et ychahbar de 19CodingSchool (42 Network)'
      }
  };
  public lg = 'fr';

  constructor() {}
}

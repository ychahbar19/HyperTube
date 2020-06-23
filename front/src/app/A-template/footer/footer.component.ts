import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  // Defines the translations for the static taxt.
  public lg = AppComponent.userLanguage;
  public txt = {
    'Created by': { en: 'Created by cbrichau, aceciora and ychahbar from 19CodingSchool (42 Network)',
                    fr: 'Créé par cbrichau, aceciora et ychahbar de 19CodingSchool (42 Network)' }
  };

  constructor() {}
}

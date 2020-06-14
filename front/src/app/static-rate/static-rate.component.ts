import { Component } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-static-rate',
  templateUrl: './static-rate.component.html',
  styleUrls: ['./static-rate.component.scss'],
  providers: [NgbRatingConfig]
})
export class StaticRateComponent {
  constructor(config: NgbRatingConfig) {
    config.max = 10;
    config.readonly = true;
  }
}

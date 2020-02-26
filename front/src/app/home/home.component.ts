import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Home } from './home.model';
import { HomeService } from '../shared/services/home.service';

@Component({
  selector: 'app-home',
  providers: [HomeService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public layout: Home[] = [];
  private layoutSubscription: Subscription;

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.homeService.getLayout();
    this.layoutSubscription = this.homeService.getLayoutUpdateListener()
      .subscribe((layoutHome: Home[]) => {
        this.layout = layoutHome;
      });
  }

  ngOnDestroy() {
    this.layoutSubscription.unsubscribe();
  }
}

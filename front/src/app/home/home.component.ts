/*
HOME (guests only)
Content:
  https://files.slack.com/files-pri/T039P7U66-FT8DT63L4/image_d___ios.jpg
  https://files.slack.com/files-pri/T039P7U66-FTBCVP3K8/screenshot_2020-01-29_at_15.04.56.png
*/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Home } from './home.model';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-home',
  providers: [HomeService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy
{
  public layout: Home[] = [];
  private layoutSubscription: Subscription;

  constructor(private homeService: HomeService) {}

  ngOnInit()
  {
    this.homeService.getLayout();
    this.layoutSubscription = this.homeService.getLayoutUpdateListener()
      .subscribe((layoutHome: Home[]) =>
      {
        this.layout = layoutHome;
      });
  }

  ngOnDestroy()
  {
    this.layoutSubscription.unsubscribe();
  }
}

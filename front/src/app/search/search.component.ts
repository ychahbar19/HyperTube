/*
GALLERY (members only)
Content:
  - Search field:
    Takes data from at least 2 sources (e.g. http://www.legittorrents.info, https://archive.org)

  - Before search:
    Thumbnail list* sorted by popularity

  - After search (= results):
    Thumbnail list* sorted by name

* Thumbnail list content:
  - Thumbnail info:
      .mandatory: name, (un)seen status
      .if available: pic, production date, rating
  - Pagination (async infinite)
  - Order filters (popularity [?], name [A>Z], date [0>9])
  - Sort filters (date [range], genre [list])
*/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { YtsModel } from './yts.model';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  providers: [SearchService],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy
{
  public ytsResults: YtsModel[] = [];
  private ytsSubscription: Subscription;

  constructor(private searchService: SearchService) {}

  ngOnInit()
  {
    this.searchService.getYtsResults();
    this.ytsSubscription = this.searchService.getYtsResultsUpdateListener()
      .subscribe((ytsResults: YtsModel[]) =>
      {
        this.ytsResults = ytsResults;
      });
  }

  ngOnDestroy()
  {
    this.ytsSubscription.unsubscribe();
  }
}

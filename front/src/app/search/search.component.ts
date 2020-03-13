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

import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-search',
  providers: [SearchService],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit
{
  public genres = [ 'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
                    'Documentary', 'Drama', 'Family', 'Fantasy', 'Film Noir', 'History',
                    'Horror', 'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi',
                    'Short Film', 'Sport', 'Superhero', 'Thriller', 'War', 'Western' ];
  public results;

  constructor(private searchService: SearchService) {}

  async ngOnInit()
  {
    this.results = await this.searchService.getResults('');
  }

  async getSearchResults(searchParams: NgForm)
  {
    let encodedSearchParams = '?';

    if (searchParams.value.query_term)
      encodedSearchParams += 'query_term=' + encodeURIComponent(searchParams.value.query_term) + '&';
    if (searchParams.value.genre)
      encodedSearchParams += 'genre=' + encodeURIComponent(searchParams.value.genre) + '&';
    if (searchParams.value.sort_by)
      encodedSearchParams += 'sort_by=' + encodeURIComponent(searchParams.value.sort_by) + '&';
    if (searchParams.value.page)
      encodedSearchParams += 'page=' + encodeURIComponent(searchParams.value.page) + '&';

    encodedSearchParams = encodedSearchParams.substring(0, encodedSearchParams.length - 1);
    this.results = await this.searchService.getResults(encodedSearchParams);
  }
}

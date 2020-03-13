/*
SEARCH GALLERY (members only)
  ==> ? | Check restriction

Page content:
  1) SEARCH
    - Search bar:
      Takes data from at least 2 sources (e.g. http://www.legittorrents.info, https://archive.org)
      ==> :) | Missing 2nd source if we don't count OMDb

    - Sort filters
      (date [range], genre [list])
      ==> :) | Missing date range because unavailable in YTS API (do it custom?)

    - Order filters
      (popularity [?], name [A>Z], date [0>9])
      ==> :) | OK let's just agree on what "popularity" should be (currently #downloads)

  2) RESULTS
    - Before search:
      Thumbnail list* sorted by popularity
      ==> :D | OK

    - After search (= results):
      Thumbnail list* sorted by name
      ==> :) | Missing overwrite of sort=name

      * Thumbnail info:
        .mandatory: name, (un)seen status
        .if available: pic, production date, rating
        ==> :) | Missing (un)seen status

    - Pagination (async infinite)
    ==> :( | To do
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

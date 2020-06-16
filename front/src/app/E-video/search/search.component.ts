import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { SearchService } from './search.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-search',
  providers: [SearchService],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  // 1) Defines the translations for the static text.
  public lg = AppComponent.userLanguage;
  public txt = {
    Genre:        { en: 'Genre', fr: 'Genre' },
    Search:       { en: 'Search...', fr: 'Rechercher...' },
    'Sort by':    { en: 'Sort by', fr: 'Ordre' },
    Popularity:   { en: 'Popularity', fr: 'Popularité' },
    Title:        { en: 'Title', fr: 'Titre' },
    Year:         { en: 'Year', fr: 'Année' },
    All:          { en: 'All', fr: 'Tous' },
    genres:       { en: [ 'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
                          'Documentary', 'Drama', 'Family', 'Fantasy', 'Film Noir', 'History',
                          'Horror', 'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi',
                          'Short Film', 'Sport', 'Superhero', 'Thriller', 'War', 'Western' ],
                    fr: [ 'Action', 'Aventure', 'Animation', 'Biographie', 'Comédie', 'Crime',
                          'Documentaire', 'Drame', 'Famille', 'Fantaisie', 'Film Noir', 'Histoire',
                          'Horreur', 'Musique', 'Comédie musicale', 'Mystère', 'Romance', 'Sci-Fi',
                          'Court-métrage', 'Sport', 'Super-héro', 'Thriller', 'Guerre', 'Western' ]}
  };

  // public results: Array<object>;
  public results: any;
  public isLoading = true;
  public isLoadingPage = false;
  public changeOrder = false;
  // public movieIsSeen: boolean;
  private page = 1;
  private encodedSearchParams = '?';
  public user: any;


  constructor(private searchService: SearchService) { }

  // 2) Triggers getSearchResults() on init.
  async ngOnInit() {
    this.results = await this.searchService.getResults('', this.lg, this.txt['genres']);
    this.isLoading = false;
  }

  // 3) Fetches the search results from the API (back) and saves them
  // in the array 'results' for output.
  async getSearchResults(searchParams: NgForm) {
    this.results = null;
    this.page = 1;
    this.encodedSearchParams = '?';

    if (searchParams.value.query_term) {
      this.encodedSearchParams += 'query_term=' + encodeURIComponent(searchParams.value.query_term) + '&';
      this.changeOrder = true;
    }
    if (!searchParams.value.query_term) {
      this.changeOrder = false;
    }
    if (searchParams.value.genre) {
      this.encodedSearchParams += 'genre=' + encodeURIComponent(searchParams.value.genre) + '&';
    }
    if (searchParams.value.sort_by) {
      this.encodedSearchParams += 'sort_by=' + encodeURIComponent(searchParams.value.sort_by) + '&';
    }

    // Remove last '&' char
    this.encodedSearchParams = this.encodedSearchParams.substring(0, this.encodedSearchParams.length - 1);
    this.results = await this.searchService.getResults(this.encodedSearchParams, this.lg, this.txt['genres']);
  }

  async onScroll() {
    this.page++;
    const pageChar = this.page.toString();
    if (this.encodedSearchParams === '?') {
      this.encodedSearchParams += 'page=' + pageChar;
    } else if (this.encodedSearchParams.includes('page=')) {
      this.encodedSearchParams = this.encodedSearchParams.replace(/page=[0-9]*/g, 'page=' + pageChar);
    } else {
      this.encodedSearchParams += '&page=' + this.page.toString();
    }
    this.isLoadingPage = true;
    this.results = this.results.concat(await this.searchService.getResults(this.encodedSearchParams, this.lg, this.txt['genres']));
    this.isLoadingPage = false;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { YtsModel } from './yts.model';

@Injectable()
export class SearchService
{
  private ytsResults: YtsModel[] = [];
  private ytsResultsUpdated = new Subject<YtsModel[]>();

  constructor(private http: HttpClient) {}

  getYtsResults()
  {
    this.http.get<{status: string, status_message: string, data: YtsModel[]}>('https://yts.mx/api/v2/list_movies.json?query_term=lord')
      .subscribe((responseData) =>
      {
        console.log(responseData.data);
        this.ytsResults = responseData.data;
        this.ytsResultsUpdated.next(this.ytsResults);
      });
  }

  getYtsResultsUpdateListener()
  {
    return this.ytsResultsUpdated.asObservable();
  }
}

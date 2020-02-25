import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Home } from '../home/home.model';

@Injectable({ providedIn: 'root' })
export class HomeService
{
  private layout: Home[] = [];
  private layoutUpdated = new Subject<Home[]>();

  constructor(private http: HttpClient) {}

  getLayout()
  {
    this.http.get<{message: string, layout_elements: Home[]}>('http://localhost:3000/')
      .subscribe((responseData) =>
      {
        this.layout = responseData.layout_elements;
        this.layoutUpdated.next(this.layout);
      });
  }

  getLayoutUpdateListener()
  {
    return this.layoutUpdated.asObservable();
  }
}

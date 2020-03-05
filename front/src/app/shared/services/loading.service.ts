import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  isLoading = new Subject<boolean>();

  getisLoading() {
    return this.isLoading.asObservable();
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public isLoading$ = new BehaviorSubject<boolean>(false);

  show() {
    console.log('LoaderService: show() called');
    this.isLoading$.next(true);
  }

  hide() {
    console.log('LoaderService: hide() called');
    this.isLoading$.next(false);
  }
}

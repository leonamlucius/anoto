import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private valueSearchSubject = new BehaviorSubject<string>('');

  public valueSearch$ = this.valueSearchSubject.asObservable();

  public setValueSearch(value: string): void {
    this.valueSearchSubject.next(value);
  }
}

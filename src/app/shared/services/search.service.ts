import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private valueSearchSubject = new BehaviorSubject<string>('');

  public valueSearch$ = this.valueSearchSubject.asObservable();

  private activeSearchSubject = new BehaviorSubject<boolean>(false);
  public activeSearch$ = this.activeSearchSubject.asObservable();

  public setValueSearch(value: string): void {
    this.valueSearchSubject.next(value);
  }

  public setActiveSearch(value: boolean): void {
    this.activeSearchSubject.next(value);
  }

  public getActiveSearch(): boolean {
    return this.activeSearchSubject.getValue();
  }
}

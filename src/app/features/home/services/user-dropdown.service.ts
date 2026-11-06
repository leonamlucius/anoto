import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Info } from '../models/info';
@Injectable({
  providedIn: 'root',
})
export class UserDropdownService {
  constructor(private http: HttpClient) {}

  private showDropdown = new BehaviorSubject<boolean>(false);

  public showDropdown$ = this.showDropdown.asObservable();

  private apiUrl = environment.apiUrl;

  public updateInfo(info: Info): Observable<Info> {
    return this.http.patch<Info>(`${this.apiUrl}/info/update`, info).pipe(
      catchError((error) => {
        console.error('Error updating info:', error);
        throw error;
      }),
    );
  }

  public getInfo(): Observable<Info> {
    return this.http.get<Info>(`${this.apiUrl}/info/get`, {}).pipe(
      catchError((error) => {
        console.error('Error fetching info:', error);
        throw error;
      }),
    );
  }

  public setDropdown(show: boolean): void {
    this.showDropdown.next(show);
  }
  public toggleDropdown(): void {
    this.showDropdown.next(!this.showDropdown.value);
  }
}

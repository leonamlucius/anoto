import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Info } from '../models/info';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  private readonly name = new Subject<Info>();

  public setName(info: Info): void {
    this.name.next(info);
  }

  public getName(): Observable<Info> {
    return this.name.asObservable();
  }

  public getInfo(): Observable<Info> {
    return this.http.get<Info>(`${this.apiUrl}/info/get`, {
    }).pipe(
      tap((info: Info) => this.setName(info)),
      catchError((error) => {
        console.error('Error fetching info:', error);
        throw error;
      }),
    );
  }
}

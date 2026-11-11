import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  shareReplay,
  throwError,
  tap,
  finalize,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Info } from '../models/info';
import { AlertService } from '../../../shared/services/alert.service';
@Injectable({
  providedIn: 'root',
})
export class UserDropdownService {
  constructor(private http: HttpClient, private alertService: AlertService) {}

  private showDropdown = new BehaviorSubject<boolean>(false);

  public showDropdown$ = this.showDropdown.asObservable();

  private apiUrl = environment.apiUrl;

  private profilePhotoRequest?: Observable<any>;

  private profilePhotoSubject = new BehaviorSubject<any>(null);
  public profilePhoto$ = this.profilePhotoSubject.asObservable();

  private allImagesRequest?: Observable<any>;

  public postProfilePhoto(fileName: string | null): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/storage/profile-photo`, { fileName })
      .pipe(
        catchError((error) => {
          console.error('Error posting profile photo:', error);
          return throwError(() => error);
        }),
        finalize(() => {
          this.alertService.show('success', 'Foto atualizada com sucesso');
        }),
        tap(() => {
          this.profilePhotoRequest = undefined;
        }),
      );
  }
  public getAllImages(): Observable<any> {
    return (this.allImagesRequest ??= this.http
      .get<any>(`${this.apiUrl}/storage/all`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching all images:', error);
          return throwError(() => error);
        }),
        shareReplay(1),
      ));
  }

  public getProfilePhoto(): Observable<any> {
    return (this.profilePhotoRequest ??= this.http
      .get<any>(`${this.apiUrl}/storage/photo`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching profile photo:', error);
          return throwError(() => error);
        }),
        tap((photo) => {
          this.profilePhotoSubject.next(photo);
        }),
        shareReplay(1),
      ));
  }

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

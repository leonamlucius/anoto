import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.production';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  private showModalSubject = new Subject<boolean>();

  public showModal$ = this.showModalSubject.asObservable();

  private foldersSubject = new Subject<any[]>();

  public folders$ = this.foldersSubject.asObservable();

  public CreateFolder(
    title: string,
    description: string,
    color: string,
    noteIds: number[],
  ): Observable<any> {
    console.log('Creating folder with data:', { title, description, color, noteIds });
    const data = { title, description, color, noteIds };
    return this.http.post(`${this.apiUrl}/folders`, data).pipe(
      finalize(() => {
        this.AllFolders().subscribe();
      }),
      catchError((error) => {
        console.error('Error creating folder:', error);
        return throwError(() => error);
      }),
    );
  }
  public setShowModal(show: boolean) {
    this.showModalSubject.next(show);
  }

  public SetFolders(folders: any[]): void {
    this.foldersSubject.next(folders);
  }
  public AllFolders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/folders`).pipe(
      tap((folders: any) => {
        this.SetFolders(folders);
      }),
      catchError((error) => {
        console.error('Error fetching folders:', error);
        return throwError(() => error);
      }),
    );
  }
}

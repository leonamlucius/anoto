import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.production';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError, BehaviorSubject } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { tap } from 'rxjs';
import { AlertService } from '../../../shared/services/alert.service';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private alertService: AlertService,
  ) {}

  private folderDeletedSubject = new BehaviorSubject<number[]>([]);

  public folderDeleted$ = this.folderDeletedSubject.asObservable();
  private selectedFolderCheckSubject = new BehaviorSubject<number[]>([]);

  public selectedFolderCheck$ = this.selectedFolderCheckSubject.asObservable();

  private showModalSubject = new Subject<boolean>();

  public showModal$ = this.showModalSubject.asObservable();

  private foldersSubject = new Subject<any[]>();

  public folders$ = this.foldersSubject.asObservable();

  public numberSelectedSubject = new BehaviorSubject<number>(0);

  public numberSelected$ = this.numberSelectedSubject.asObservable();


  public PutFolder(folderId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/folders/${folderId}`, data).pipe(
      finalize(() => {
        this.AllFolders().subscribe();
      }),
      catchError((error) => {
        console.error('Error updating folder:', error);
        return throwError(() => error);
      }),
    );
  }

  public DeleteFolder(folderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/folders/${folderId}`).pipe(
      finalize(() => {
        this.AllFolders().subscribe();
      }),
      catchError((error) => {
        console.error('Error deleting folder:', error);
        return throwError(() => error);
      }),
    );
  }
  public setFolderDeleted(folderId: number[]): void {
    this.folderDeletedSubject.next(folderId);
  }
  public setSelectedFolderCheck(ids: number[]): void {
    this.selectedFolderCheckSubject.next(ids);
  }
  public getSelectedFolderCheck(): number[] {
    return this.selectedFolderCheckSubject.getValue();
  }

  public setSelectedFolderLength(length: number): void {
    this.numberSelectedSubject.next(length);
  }

  public getSelectedFolderLength(): number {
    return this.numberSelectedSubject.getValue();
  }
  public toggleSelectedFolderCheck(id: number): void {
    const current = this.selectedFolderCheckSubject.getValue();
    this.selectedFolderCheckSubject.next(
      current.includes(id) ? current.filter((i) => i !== id) : [...current, id],
    );

    this.setSelectedFolderLength(
      this.selectedFolderCheckSubject.getValue().length,
    );
  }
  public CreateFolder(
    title: string,
    description: string,
    color: string,
    noteIds: number[],
  ): Observable<any> {
    if (!title || !description || !color) {
      this.alertService.show(
        'error',
        'Todos os campos são obrigatórios. Por favor, preencha todos os campos.',
      );
      return throwError(() => new Error('Invalid folder data'));
    }
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
  public LinkFolder(
    folderId: number | number[],
    noteIds: number[],
  ): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/folders/link/${folderId}`, { noteIds })
      .pipe(
        switchMap(() => this.AllFolders()),
        catchError((error) => {
          console.error('Error linking folder:', error);
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

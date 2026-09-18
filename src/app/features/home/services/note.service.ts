import { Injectable, inject } from '@angular/core';
import { AlertService } from '../../../shared/services/alert.service';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  Subject,
  tap,
} from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Note } from '../models/note';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  constructor(
    private alertService: AlertService,
    private http: HttpClient,
  ) {}

  private readonly allNotes = new BehaviorSubject<Note[]>([]);

  public readonly allNotesObservable$ = this.allNotes.asObservable();

  private apiUrl = environment.apiUrl;

  public Allnotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/notes`, {}).pipe(
      tap((notes) => this.allNotes.next(notes)),
      catchError((error) => {
        console.error('Failed to fetch notes:', error);
        this.alertService.show(
          'error',
          'Falha ao buscar notas. Por favor, tente novamente.',
        );
        return of([]);
      }),
    );
  }

  public Postnote(
    title: string,
    content: string,
    color: string,
  ): Observable<Note[]> {
    return this.http
      .post<Note[]>(`${this.apiUrl}/notes`, { title, content, color })
      .pipe(
        catchError((error) => {
          console.error('Failed to post note:', error);
          this.alertService.show(
            'error',
            'Falha ao criar nota. Por favor, tente novamente.',
          );
          return of([]);
        }),
      );
  }

  public Deletenote(id: number): Observable<Note[] | void> {
    return this.http.delete<Note[]>(`${this.apiUrl}/notes/${id}`, {}).pipe(
      catchError((error) => {
        console.error('Failed to delete note:', error);
        this.alertService.show(
          'error',
          'Falha ao deletar nota. Por favor, tente novamente.',
        );
        return of([]);
      }),
    );
  }

  public Putnote(
    id: number,
    title: string,
    content: string,
    color: string,
  ): Observable<Note[]> {
    return this.http
      .put<Note[]>(`${this.apiUrl}/notes/${id}`, { title, content, color })
      .pipe(
        catchError((error) => {
          console.error('Failed to update note:', error);
          this.alertService.show(
            'error',
            'Falha ao atualizar nota. Por favor, tente novamente.',
          );
          return of([]);
        }),
      );
  }
}

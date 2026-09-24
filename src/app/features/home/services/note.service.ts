import { Injectable, inject, signal } from '@angular/core';
import { AlertService } from '../../../shared/services/alert.service';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  Subject,
  tap,
  finalize,
  combineLatest,
} from 'rxjs';
import { map } from 'rxjs/operators';
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

  public allNotesObservable$ = this.allNotes.asObservable();

  public loadingFixed = signal(false);

  private selectedColorSubject = new BehaviorSubject<string | null>(null);
  public selectedColor$ = this.selectedColorSubject.asObservable();

  public filteredNotes$: Observable<Note[]> = combineLatest([
    this.allNotesObservable$,
    this.selectedColor$,
  ]).pipe(
    map(([notes, color]) => {
      if (!color) {
        return notes;
      }
      return notes.filter((note) => note.color === color);
    }),
  );

  private apiUrl = environment.apiUrl;

  public toggleColorFilter(color: string | null) {
    const currentColor = this.selectedColorSubject.getValue();
    if (currentColor === color) {
      this.selectedColorSubject.next(null);
    } else {
      this.selectedColorSubject.next(color);
    }
  }
  public set SetAllNotes(notes: Observable<Note[]>) {
    notes.subscribe((n) => this.allNotes.next(n));
  }

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

  public FixNote(id: number): Observable<Note[]> {
    if (this.loadingFixed()) {
      return of([]);
    }
    this.loadingFixed.set(true);
    return this.http.put<Note[]>(`${this.apiUrl}/notes/fixed/${id}`, {}).pipe(
      catchError((error) => {
        console.error('Failed to fix note:', error);
        this.alertService.show(
          'error',
          'Falha ao fixar nota. Por favor, tente novamente.',
        );
        return of([]);
      }),
      finalize(() => this.loadingFixed.set(false)),
    );
  }
}

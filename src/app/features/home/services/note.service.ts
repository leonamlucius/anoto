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
  throwError,
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

  public loading = signal(false);

  private selectedColorSubject = new BehaviorSubject<string | null>(null);
  public selectedColor$ = this.selectedColorSubject.asObservable();

  private orderBySubject = new BehaviorSubject<string | null>('newest');
  public orderBy$ = this.orderBySubject.asObservable();

  private viewSubject = new BehaviorSubject<'notes' | 'list'>('notes');
  public view$ = this.viewSubject.asObservable();

  private showOtherViewSubject = new BehaviorSubject<boolean>(false);
  public showOtherView$ = this.showOtherViewSubject.asObservable();

  private actionbarActiveSubject = new Subject<boolean>();
  public actionbarActive$ = this.actionbarActiveSubject.asObservable();

  private numberSelectedSubject = new BehaviorSubject<number>(0);
  public numberSelected$ = this.numberSelectedSubject.asObservable();

  private selectedNoteActionSubject = new BehaviorSubject<Note[]>([]);
  public selectedNoteAction$ = this.selectedNoteActionSubject.asObservable();

  private deleteNoteSubject = new BehaviorSubject<number[]>([]);
  public deleteNote$ = this.deleteNoteSubject.asObservable();

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

  public setDeleteNote(id: number[] ) {
    this.deleteNoteSubject.next(id);
  }

  public hasSelectedNoteAction(id: number): boolean {
    return this.selectedNoteActionSubject.value.some((note) => note.id === id);
  }

  public getSelectedNoteActions(): Note[] {
    return this.selectedNoteActionSubject.value;
  }

  public setSelectedNoteAction(selectedNoteAction: any) {
    this.selectedNoteActionSubject.next(selectedNoteAction);
  }
  public setNumberSelected(number: number) {
    this.numberSelectedSubject.next(number);
  }

  public setActionbarActive(active: boolean) {
    this.actionbarActiveSubject.next(active);
  }
  public setLoading() {
    this.loading.set(!this.loading().valueOf());
  }

  public falseShowOtherView() {
    this.showOtherViewSubject.next(false);
  }
  public trueShowOtherView() {
    if (this.showOtherViewSubject.getValue() === true) {
      return;
    }
    this.showOtherViewSubject.next(true);
  }

  public setOrderBy(orderBy: string | null) {
    this.orderBySubject.next(orderBy);
  }

  public setView(view: 'notes' | 'list') {
    this.viewSubject.next(view);
  }

  public toggleColorFilter(color: string | null) {
    const currentColor = this.selectedColorSubject.getValue();
    if (currentColor === color) {
      this.selectedColorSubject.next(null);
    } else {
      this.selectedColorSubject.next(color);
    }
  }

  public setNotes(notes: Note[]) {
    this.allNotes.next(notes);
  }
  public FetchNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/notes`, {}).pipe(
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
  public Allnotes(): Observable<Note[]> {
    return this.FetchNotes().pipe(tap((notes) => this.allNotes.next(notes)));
  }

  public Postnote(
    title: string,
    content: string,
    color: string,
  ): Observable<Note[]> {
    if (!title || !content || !color) {
      this.alertService.show(
        'error',
        'Todos os campos são obrigatórios. Por favor, preencha todos os campos.',
      );

      return throwError(() => new Error('All fields are required'));
    }

    return this.http
      .post<Note[]>(`${this.apiUrl}/notes`, { title, content, color })
      .pipe(
        catchError((error) => {
          console.error('Failed to post note:', error);
          return throwError(() => error);
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
    if (!title || !content || !color) {
      this.alertService.show(
        'error',
        'Todos os campos são obrigatórios. Por favor, preencha todos os campos.',
      );
      return of([]);
    }

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

  public FixNote(id: number | number[] | Note): Observable<Note[]> {
    return this.http.put<Note[]>(`${this.apiUrl}/notes/fixed/${id}`, {}).pipe(
      catchError((error) => {
        console.error('Failed to fix note:', error);
        this.alertService.show(
          'error',
          'Falha ao fixar nota. Por favor, tente novamente.',
        );
        return of([]);
      }),
    );
  }
}

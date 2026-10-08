import {
  Component,
  effect,
  OnInit,
  signal,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { Note } from '../../models/note';
import { AsyncPipe } from '@angular/common';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { DeleteComponent } from '../../../../shared/components/delete/delete.component';
import { NoteService } from '../../services/note.service';
import { OnDestroy } from '@angular/core';
import {
  Observable,
  Subscription,
  tap,
  finalize,
  map,
  combineLatest,
  firstValueFrom,
  switchMap,
} from 'rxjs';
import { ErrorComponent } from '../../../../shared/components/error/error.component';
import { WelcomeComponent } from '../../../../shared/components/welcome/welcome.component';
@Component({
  selector: 'app-notes',
  imports: [
    AsyncPipe,
    ModalComponent,
    DeleteComponent,
    ErrorComponent,
    WelcomeComponent,
  ],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  showDeleteModal = signal(false);
  constructor(protected noteService: NoteService) {
    effect(() => {
      if (!this.showDeleteModal()) {
        this.noteService.setDeleteNote([]);
      }
    });
    
  }

  private cdr = inject(ChangeDetectorRef);

  public pageAreLoaded: boolean = false;

  public notes$!: Observable<Note[]>;

  public notesFixed$!: Observable<Note[]>;

  public notesNotFixed$!: Observable<Note[]>;

  public view$!: Observable<string | 'notes' | 'list'>;

  activeNoteId: number | null = null;

  showModal = signal(false);

  selectedNote: any = null;

  selectedNoteIdEdit: number | null = null;

  selectedNoteIdFixed: number | null = null;

  suspendNoteIdEdit = <number | null>null;

  private longPressTimer?: ReturnType<typeof setTimeout>;

  inputChange = signal(false);

  colors = [
    { color: '#FFF176' },
    { color: '#F48FB1' },
    { color: '#A5D6A7' },
    { color: '#90CAF9' },
    { color: '#FFCC80' },
    { color: '#CE93D8' },
  ];

  ngOnInit() {
    this.view$ = this.noteService.view$;
    this.noteService
      .Allnotes()
      .pipe(finalize(() => this.loadNotes()))
      .subscribe();
    this.notes$ = this.noteService.filteredNotes$;

    this.notesNotFixed$ = combineLatest([
      this.notes$,
      this.noteService.orderBy$,
    ]).pipe(
      map(([notes, orderBy]) =>
        [...notes]
          .filter((note) => !note.fixed)
          .sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();

            return orderBy === 'newest' ? timeB - timeA : timeA - timeB;
          })
          .map((note) => ({
            ...note,

            createdAt: this.formatDate(note.createdAt),
            updatedAt: this.formatDate(
              note.updatedAt ? note.updatedAt : null,
              true,
            ),
          })),
      ),
    );

    this.notesFixed$ = combineLatest([
      this.notes$,
      this.noteService.orderBy$,
    ]).pipe(
      map(([notes, orderBy]) =>
        [...notes]
          .filter((note) => note.fixed)
          .sort((a, b) => {
            return orderBy === 'newest'
              ? new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              : new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime();
          })
          .map((note) => ({
            ...note,
            createdAt: this.formatDate(note.createdAt),
            updatedAt: this.formatDate(
              note.updatedAt ? note.updatedAt : null,
              true,
            ),
          })),
      ),
    );
  }

  public markNoteAction(id: number, event: PointerEvent, isFixed: boolean) {
    if (event.pointerType != 'touch') {
      return;
    }

    const selectedNoteActions = this.noteService.getSelectedNoteActions();

    if (selectedNoteActions.some((note) => note.id === id)) {
      const updatedSelection = selectedNoteActions.filter(
        (note) => note.id !== id,
      );
      this.noteService.setSelectedNoteAction(updatedSelection);
      this.suspendNoteIdEdit = id;
      this.cancelMarkNoteAction();
      this.noteService.setNumberSelected(updatedSelection.length);

      if (updatedSelection.length === 0) {
        this.noteService.setActionbarActive(false);
      }
      return;
    }

    this.cancelMarkNoteAction();
    this.longPressTimer = setTimeout(() => {
      const updatedSelection = [
        ...this.noteService.getSelectedNoteActions(),
        { id },
      ];
      this.noteService.setSelectedNoteAction(updatedSelection);
      this.suspendNoteIdEdit = id;
      this.noteService.setActionbarActive(true);
      this.noteService.setNumberSelected(updatedSelection.length);
      this.longPressTimer = undefined;
    }, 600);
  }

  public cancelMarkNoteAction() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = undefined;
    }
  }

  public formatDate(date: string | any, includeHour: boolean = false): any {
    if (!date) return null;
    let dateString = date?.slice(0, 10) || '';

    let actualDate: string = new Date().toISOString().slice(0, 10);

    let day = parseInt(dateString?.slice(8, 10) || '0', 10);
    let month = parseInt(dateString?.slice(5, 7) || '0', 10);
    let year = parseInt(date?.slice(0, 6) || '0', 10);

    let hour = parseInt(date?.slice(11, 13) || '0', 10);
    let minute = parseInt(date?.slice(14, 16) || '0', 10);

    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');

    if (
      month === parseInt(actualDate?.slice(5, 7) || '0', 10) &&
      day === parseInt(actualDate?.slice(8, 10) || '0', 10) - 1
    ) {
      if (includeHour) {
        return `Ontem às ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      }
      return 'Ontem';
    }

    if (dateString === actualDate) {
      if (includeHour) {
        return `Hoje às ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      }
      return 'Hoje';
    }

    if (month < new Date().getMonth() + 1) {
      if (includeHour) {
        return `${formattedDay}/${formattedMonth}/${year} às ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      }
      return `${formattedDay}/${formattedMonth}/${year}`;
    }

    const weekday = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
    }).format(new Date(year, month - 1, day));

    if (includeHour) {
      return `${weekday.slice(0, 3).charAt(0).toUpperCase()}${weekday.slice(1, 3)}, ${formattedDay}/${formattedMonth} às ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    return `${weekday.slice(0, 3).charAt(0).toUpperCase()}${weekday.slice(1, 3)}, ${formattedDay}/${formattedMonth}`;
  }
  async loadNotes() {
    this.pageAreLoaded = true;
  }

  public async fixNote(id: number, fixed: boolean | null = null) {
    this.cdr.detectChanges();

    this.selectedNoteIdFixed = id;

    if (fixed === null) {
      this.noteService.trueShowOtherView();
    }

    if (fixed !== null) {
      this.noteService.falseShowOtherView();
      this.selectedNote.fixed = fixed;
    }

    await firstValueFrom(this.noteService.FixNote(this.selectedNoteIdFixed));
    const notes = await firstValueFrom(this.noteService.FetchNotes());

    const updateDOM = async () => {
      this.noteService.setNotes(notes);
      this.cdr.detectChanges();
      this.selectedNoteIdFixed = null;
    };

    if ('startViewTransition' in document) {
      (document as any).startViewTransition(updateDOM);
    } else {
      await updateDOM();
    }
  }

  public createModalDelete(id: number) {
    this.noteService.setDeleteNote([id]);

    this.showDeleteModal.set(true);
  }

  public createModalEdit(note: any = null) {
    if (this.suspendNoteIdEdit === note?.id) {
      this.suspendNoteIdEdit = null;
      return;
    }
    this.noteService.falseShowOtherView();
    this.selectedNoteIdEdit = note?.id;

    this.cdr.detectChanges();

    const updateDOM = () => {
      this.selectedNote = note;
      this.cdr.detectChanges();
    };

    if ('startViewTransition' in document) {
      (document as any).startViewTransition(updateDOM);
    } else {
      updateDOM();
    }
  }

  public closeModalEdit(
    id: number,
    title: string,
    content: string,
    color: string,
  ) {
    if (!this.selectedNote) return;

    if (this.inputChange()) {
      this.putNote(id, title, content, color);
    }

    const updateDOM = () => {
      this.selectedNote = null;
      this.cdr.detectChanges();
    };

    if ('startViewTransition' in document) {
      const transition = (document as any).startViewTransition(updateDOM);

      transition.finished.then(() => {
        this.selectedNoteIdEdit = null;
        this.cdr.detectChanges();
      });
    } else {
      updateDOM();
    }
  }

  public inputChanged() {
    if (!this.inputChange()) {
      this.inputChange.set(true);
    }
  }

  public putNote(id: number, note: any, content: string, color: string) {
    this.noteService
      .Putnote(id, note, content, color)
      .pipe(
        finalize(() => {
          this.inputChange.set(false);
          this.selectedNoteIdEdit = null;
        }),
        switchMap(() => this.noteService.Allnotes()),
      )
      .subscribe();
  }

  public selectColor(color: string) {
    this.inputChanged();
    if (this.selectedNote) {
      this.selectedNote.color = color;
    }
  }

  public showEdit(note: any) {
    this.activeNoteId = note.id;
  }

  public hideEdit(note: any) {
    this.activeNoteId = null;
  }
}

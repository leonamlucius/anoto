import { Component, OnInit, signal } from '@angular/core';
import { Note } from '../../models/note';
import { AsyncPipe } from '@angular/common';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { DeleteComponent } from '../../../../shared/components/delete/delete.component';
import { NoteService } from '../../services/note.service';
import { OnDestroy } from '@angular/core';
import { Observable, Subscription, tap, finalize, map } from 'rxjs';
import { ErrorComponent } from '../../../../shared/components/error/error.component';
@Component({
  selector: 'app-notes',
  imports: [AsyncPipe, ModalComponent, DeleteComponent, ErrorComponent],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  constructor(protected noteService: NoteService) {}

  public pageAreLoaded: boolean = false;

  private sub!: Subscription;

  public notes$!: Observable<Note[]>;

  public notesFixed$!: Observable<Note[]>;

  public notesNotFixed$!: Observable<Note[]>;

  public loadingFixed = signal(false);

  ngOnInit() {
    this.noteService
      .Allnotes()
      .pipe(finalize(() => this.loadNotes()))
      .subscribe();
    this.notes$ = this.noteService.filteredNotes$;
    this.notesNotFixed$ = this.notes$.pipe(
      map(notes => notes.filter(note => !note.fixed))
    );
    this.notesFixed$ = this.notes$.pipe(
      map(notes => notes.filter(note => note.fixed))
    );
  }
  async loadNotes() {
    this.pageAreLoaded = true;
  }

  activeNoteId: number | null = null;

  showModal = false;

  showDeleteModal = false;


  public fixNote(id: number) {
    this.noteService.FixNote(id)
    .subscribe(
      () => {
        this.noteService.Allnotes().subscribe(); 
      }
    );
  }

  public showModalCreateNote() {
    document.insertBefore;
  }

  selectedNote: any = null;

  public createModal(note: any = null) {
    this.selectedNote = note;
    this.showModal = true;
  }

  selectedNoteId: number | null = null;
  public createModalDelete(
    id: number,
    title: string,
    content: string,
    color: string,
  ) {
    this.selectedNoteId = id;
    this.showDeleteModal = true;
  }

  public showEdit(note: any) {
    this.activeNoteId = note.id;
    this.activeNoteId = note.id;
  }

  public hideEdit(note: any) {
    this.activeNoteId = null;
    this.activeNoteId = null;
  }
}

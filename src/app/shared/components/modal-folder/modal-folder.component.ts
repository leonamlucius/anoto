import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FolderService } from '../../../features/home/services/folder.service';

import { NoteService } from '../../../features/home/services/note.service';
import { Note } from '../../../features/home/models/note';
import { catchError, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-modal-folder',
  imports: [FormsModule, AsyncPipe],
  templateUrl: './modal-folder.component.html',
  styleUrls: ['./modal-folder.component.scss'],
})
export class ModalFolderComponent implements OnInit {
  constructor(
    private folderService: FolderService,
    protected noteService: NoteService,
  ) {}

  showModal: boolean = false;

  selectedColor: string = '';

  selectedNote: number[] = [];

  activeNotes: boolean = false;

  isLoading: boolean = false;

  colors = [
    { color: '#FFF176' },
    { color: '#F48FB1' },
    { color: '#A5D6A7' },
    { color: '#90CAF9' },
    { color: '#FFCC80' },
    { color: '#CE93D8' },
  ];

  notes: Note[] = [];

  ngOnInit(): void {
    this.folderService.showModal$.subscribe((show: boolean) => {
      this.showModal = show;
    });

    this.noteService
      .Allnotes()
      .pipe(
        tap((notes: Note[]) => {
          this.notes = notes;
        }),
      )
      .subscribe();
  }

  setIsLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  public toggleActiveNotes(): void {
    this.activeNotes = !this.activeNotes;
  }

  public submitFolder(title: string, description: string): void {
    this.setIsLoading(true);
    this.folderService
      .CreateFolder(title, description, this.selectedColor, this.selectedNote)
      .pipe(
        catchError((error) => {
          setTimeout(() => {
            this.setIsLoading(false);
          }, 1000);
          throw error;
        }),
      )
      .subscribe(() => {
        this.setIsLoading(false);
        this.closeModal();
      });
  }
  public selectNote(note: Note): void {
    if (this.selectedNote.includes(note.id)) {
      this.selectedNote = this.selectedNote.filter((n) => n !== note.id);
    } else {
      this.selectedNote.push(note.id);
    }
  }
  public selectColor(color: string): void {
    this.selectedColor = color;
  }

  public closeModal(): void {
    this.selectedColor = '';
    this.selectedNote = [];
    this.folderService.setShowModal(false);
  }
}

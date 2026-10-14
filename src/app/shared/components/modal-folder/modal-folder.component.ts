import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FolderService } from '../../../features/home/services/folder.service';

import { NoteService } from '../../../features/home/services/note.service';
import { Note } from '../../../features/home/models/note';
import { tap } from 'rxjs';

@Component({
  selector: 'app-modal-folder',
  imports: [FormsModule],
  templateUrl: './modal-folder.component.html',
  styleUrls: ['./modal-folder.component.scss'],
})
export class ModalFolderComponent implements OnInit {
  constructor(
    private folderService: FolderService,
    private noteService: NoteService,
  ) {}

  showModal: boolean = false;

  selectedColor: string = '';

  selectedNote: number[] = [];

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

  submitFolder(title: string, description: string): void {

 
    this.folderService
      .CreateFolder(title, description, this.selectedColor, this.selectedNote)
      .subscribe(() => {
        this.closeModal();
      });
  }
  selectNote(note: Note): void {
    if (this.selectedNote.includes(note.id)) {
      this.selectedNote = this.selectedNote.filter((n) => n !== note.id);
    } else {
      this.selectedNote.push(note.id);
    }
  }
  selectColor(color: string): void {
    this.selectedColor = color;
  }

  closeModal(): void {
    this.selectedColor = '';
    this.selectedNote = [];
    this.folderService.setShowModal(false);
  }
}

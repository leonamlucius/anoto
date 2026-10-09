import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NoteService } from '../../../features/home/services/note.service';

import { Input } from '@angular/core';
@Component({
  selector: 'app-delete',
  imports: [AsyncPipe],
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent implements OnInit {
  public noteId: number[] | null = null;
  constructor(private noteService: NoteService) {}

  ngOnInit() {
    this.noteService.deleteNote$.subscribe((noteId) => {
      this.noteId = noteId;
    });
  }

  public isLoading: boolean = false;

  close() {
    this.noteService.setShowDeleteModal(false);
    this.noteService.setSelectedNoteAction([]);
    this.noteService.setActionbarActive(false);
  }

  public setLoadingState(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  public async deleteNote() {
    if (this.isLoading) {
      return;
    }
    if (this.noteId !== null) {
      this.setLoadingState(true);

      this.noteId.forEach((id) => {
        this.noteService.Deletenote(id).subscribe(() => {
          this.setLoadingState(false);
          this.noteService.Allnotes().subscribe();
          this.close();
        });
      });
    }
  }
}

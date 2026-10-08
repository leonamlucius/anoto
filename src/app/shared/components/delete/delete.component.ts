import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NoteService } from '../../../features/home/services/note.service';

import { Input } from '@angular/core';
@Component({
  selector: 'app-delete',
  imports: [],
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  public noteId: number[] | null = null;
  constructor(private noteService: NoteService) {}

  ngOnInit(){
    this.noteService.deleteNote$.subscribe((noteId) => {
      this.noteId = noteId;
    });
  }

  public isLoading: boolean = false;

  close() {
    this.closeModal.emit();
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

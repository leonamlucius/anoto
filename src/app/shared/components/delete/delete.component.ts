import { Component, EventEmitter, Output } from '@angular/core';
import { NoteService } from '../../../features/home/services/note.service';
import { NgIf } from '@angular/common';
import { Input } from '@angular/core';
@Component({
  selector: 'app-delete',
  imports: [NgIf],
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent {
  @Output() closeModal = new EventEmitter<void>();

  @Input() noteId!: number;
  constructor(private noteService: NoteService) {}

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
    if (this.noteId) {
      this.setLoadingState(true);
      this.noteService.Deletenote(this.noteId).subscribe(() => {
        this.setLoadingState(false);
        this.noteService.Allnotes().subscribe();
        this.close();
      });
    }
  }
}

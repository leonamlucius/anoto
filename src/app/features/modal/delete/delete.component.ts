import { Component, EventEmitter, Output } from '@angular/core';
import { ServicesService } from '../../../core/services.service';
import { Input } from '@angular/core';
@Component({
  selector: 'app-delete',
  imports: [],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss',
})
export class DeleteComponent {
  @Output() closeModal = new EventEmitter<void>();

  @Input() noteId!: number;
  constructor(private services: ServicesService) {}
  
  close() {
    this.closeModal.emit();
  }

  public async deleteNote() {
  if (this.noteId) {
    this.services.Deletenote(this.noteId).then(() => {
      this.services.notesUpdated$.next();
      this.close();
    });
  }
}
}

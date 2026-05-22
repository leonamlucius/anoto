import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-delete',
  imports: [],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss',
})
export class DeleteComponent {
  @Output() closeModal = new EventEmitter<void>();
  
  close() {
    this.closeModal.emit();
  }
}

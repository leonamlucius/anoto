import { Component, EventEmitter, Output } from '@angular/core';

import { NgFor } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [NgFor],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  title: string = 'teste';
  message: string = 'teste';

  @Output() closeModal = new EventEmitter<void>();

  notes = [
    { id: 1, title: 'Note 1', content: 'Content of Note 1', color: '#FFF176' },
    { id: 2, title: 'Note 2', content: 'Content of Note 2', color: ' #F48FB1' },
    { id: 3, title: 'Note 3', content: 'Content of Note 3', color: '#A5D6A7' },
    { id: 4, title: 'Note 4', content: 'Content of Note 4', color: '#90CAF9' },
    { id: 5, title: 'Note 5', content: 'Content of Note 5', color: '#FFCC80' },
    { id: 6, title: 'Note 6', content: 'Content of Note 6', color: ' #CE93D8' },
  ];

  close() {
    this.closeModal.emit();
  }

  public selectNote(event: MouseEvent) {
    const clicked = event.currentTarget as HTMLElement;

    if (clicked.classList.contains('active')) {
      clicked.classList.remove('active');
      return;
    }

    document
      .querySelectorAll('.color-option')
      .forEach((n) => n.classList.remove('active'));
    clicked.classList.add('active');
  }
}

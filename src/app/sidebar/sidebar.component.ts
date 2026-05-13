import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-sidebar',
  imports: [NgFor],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  notes = [
    { id: 1, title: 'Note 1', content: 'Content of Note 1', color: '#FFF176' },
    { id: 2, title: 'Note 2', content: 'Content of Note 2', color: ' #F48FB1' },
    { id: 3, title: 'Note 3', content: 'Content of Note 3', color: '#A5D6A7' },
    { id: 4, title: 'Note 4', content: 'Content of Note 4', color: '#90CAF9' },
    { id: 5, title: 'Note 5', content: 'Content of Note 5', color: '#FFCC80' },
    { id: 6, title: 'Note 6', content: 'Content of Note 6', color: ' #CE93D8' },
  ];

  booleanValue = true;

  public hiddeNoteContent() {
    const colorsDiv = document.querySelector('.colors');
    if (colorsDiv && this.booleanValue !== false) {
      colorsDiv.classList.remove('active');
    }
  }

  public showNoteContent() {
    const colorsDiv = document.querySelector('.colors');
    if (colorsDiv) {
      colorsDiv.classList.add('active');
    }
  }

  public toggleNoteContent() {
    this.booleanValue = !this.booleanValue;
    const colorsDiv = document.querySelector('.colors');
    if (colorsDiv) {
      colorsDiv.classList.toggle('active');
    }
  }
  public selectNote(event: MouseEvent) {
  const clicked = event.currentTarget as HTMLElement;

  if (clicked.classList.contains('active')) {
    clicked.classList.remove('active');
    return;
  }

  document.querySelectorAll('.note').forEach((n) => n.classList.remove('active'));
  clicked.classList.add('active');
}
}

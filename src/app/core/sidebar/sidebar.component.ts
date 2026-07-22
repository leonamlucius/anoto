import { Component, inject, signal } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { ModalComponent } from '../../features/modal/modal.component';
import { RouterLink } from '@angular/router';
import { ServicesService } from '../services.service';
import { AlertService } from '../../features/modal/alert/service/service.component';
@Component({
  selector: 'app-sidebar',
  imports: [NgFor, NgIf, NgClass, ModalComponent, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  public notesGet = signal<any[]>([]);

  constructor(
    private services: ServicesService,
    private alertService: AlertService,
  ) {}

  showModal = false;
  notes = [
    { id: 1, title: 'Note 1', content: 'Content of Note 1', color: '#FFF176' },
    { id: 2, title: 'Note 2', content: 'Content of Note 2', color: '#F48FB1' },
    { id: 3, title: 'Note 3', content: 'Content of Note 3', color: '#A5D6A7' },
    { id: 4, title: 'Note 4', content: 'Content of Note 4', color: '#90CAF9' },
    { id: 5, title: 'Note 5', content: 'Content of Note 5', color: '#FFCC80' },
    { id: 6, title: 'Note 6', content: 'Content of Note 6', color: '#CE93D8' },
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
  public async selectNote(event: MouseEvent) {
    this.notesGet.set([]);

    const clicked = event.currentTarget as HTMLElement;

    const id = clicked.getAttribute('id');

    const notes = await this.services.Allnotes();
    this.notesGet.set(notes ?? []);

    if (this.notesGet().length === 0) {
      this.alertService.show('warning', 'Sem notas criadas.');

      return;
    }

    const noNotesColor = document.querySelector(
      '.no-notes-color',
    ) as HTMLElement;

    if (noNotesColor) {
      noNotesColor.style.display = 'none';
    }

    document.querySelectorAll(`.note-card`).forEach((c) => {
      c.classList.remove('none');
      c.classList.add('animate');
    });

    console.log('ID da nota clicada:', id);
    if (clicked.classList.contains('active')) {
      clicked.classList.remove('active');

      document.querySelectorAll(`.note-card`).forEach((c) => {
        c.classList.remove('none');
        c.classList.remove('animate');
      });
      return;
    }

    document
      .querySelectorAll('.note')
      .forEach((n) => n.classList.remove('active'));

    clicked.classList.add('active');

    document
      .querySelectorAll(`.note-card:not([id="${id}"])`)
      .forEach((c) => c.classList.add('none'));

    const filtredNote = document.querySelectorAll(`.note-card[id="${id}"]`);

    if (filtredNote.length === 0) {
      if (noNotesColor) {
        noNotesColor.style.display = 'flex';
      }
    }
  }

  public showModalCreateNote() {
    document.insertBefore;
  }

  public createModal() {
    this.showModal = true;
  }
}

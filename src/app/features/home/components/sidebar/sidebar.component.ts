import { Component, inject, signal} from '@angular/core';

import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { RouterLink } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { Observable, catchError, of, map, take} from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [ModalComponent, RouterLink, AsyncPipe],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor(
    protected noteService: NoteService,
    private alertService: AlertService,
  ) {}

  public notesGet = signal<any[]>([]);

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

  public haveNotes$!: Observable<boolean>;

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
    const clicked = event.currentTarget as HTMLElement;

    this.noteService.allNotesObservable$.pipe(take(1)).subscribe((notes) => {
      if (notes.length === 0) {
        this.alertService.show('warning', 'Sem notas criadas.');
        return;
      }

      // Alterna a cor selecionada no serviço de forma limpa
      this.noteService.toggleColorFilter(clicked.getAttribute('id'));
    });
  }

  public showModalCreateNote() {
    document.insertBefore;
  }

  public createModal() {
    this.showModal = true;
  }
}

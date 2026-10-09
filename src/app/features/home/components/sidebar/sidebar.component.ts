import { Component, inject, signal } from '@angular/core';

import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { AddComponent } from '../../../../shared/components/add/add.component';
import { RouterLink, ɵEmptyOutletComponent } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { ProfileComponent } from '../../../home/components/profile/profile.component';
import { Observable, catchError, of, map, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [
    ModalComponent,
    AddComponent,
    RouterLink,
    AsyncPipe,
    ɵEmptyOutletComponent,
    ProfileComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor(
    protected noteService: NoteService,
    private alertService: AlertService,
  ) {}

  public notesGet = signal<any[]>([]);
  colors = [
    { color: '#FFF176' },
    { color: '#F48FB1' },
    { color: '#A5D6A7' },
    { color: '#90CAF9' },
    { color: '#FFCC80' },
    { color: '#CE93D8' },
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
}

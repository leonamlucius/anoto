import { Component, signal } from '@angular/core';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-toolbar',
  imports: [],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  constructor(private noteService: NoteService) {}
  public activeAction = signal<boolean>(false);
  public activeItem = signal<'date'| 'notes' | string | null>(null);

  public activeView = signal<'notes' | 'list'>('notes');

  public items = [
    {
      label: 'date',
      icon: `<span class="material-symbols-outlined">
      calendar_today
      </span>`,
      description: 'Data',
    },

    {
      label: 'notes',
      icon: `<span class="material-symbols-outlined">
      splitscreen
      </span>`,
      description: 'Estilos de visualização',
    },
  ];

  public setActiveItem(item: 'date' | 'notes' | string | null) {
    if (this.activeItem() === item) {
      setTimeout(() => {
        this.activeAction.set(false);
      }, 300);

      this.activeItem.set(null);
    } else {
      setTimeout(() => {
        this.activeAction.set(true);
        this.activeItem.set(item);
      }, 300);
    }
  }

  public setOrderBy(orderBy: string | null) {
    this.noteService.setOrderBy(orderBy);
  }

  public setActiveView(view: 'notes' | 'list') {
    setTimeout(() => {
      this.activeView.set(view);
    }, 300);
     this.noteService.setView(view);
  }
}

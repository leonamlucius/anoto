import { Component, signal, ChangeDetectorRef, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-toolbar',
  imports: [AsyncPipe],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  constructor(protected noteService: NoteService) {}
  public activeAction = signal<boolean>(false);
  public activeItem = signal<'date' | 'notes' | string | null>(null);

  public activeView = signal<'notes' | 'list'>('notes');

  private cdr = inject(ChangeDetectorRef);

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
        this.activeItem.set(item);
      }, 300);

      this.activeAction.set(true);
    }
  }

  public setOrderBy(orderBy: string | null) {
    this.cdr.detectChanges();

    this.noteService.trueShowOtherView();

    const updateDOM = () => {
      this.noteService.setOrderBy(orderBy);
      this.cdr.detectChanges();
    };

    if ('startViewTransition' in document) {
      (document as any).startViewTransition(updateDOM);
    } else {
      updateDOM();
    }
  }

  public setActiveView(view: 'notes' | 'list') {
    this.cdr.detectChanges();

    this.noteService.trueShowOtherView();

    const updateDOM = () => {
      this.activeView.set(view);

      this.noteService.setView(view);

      this.cdr.detectChanges();
    };
    if ('startViewTransition' in document) {
      (document as any).startViewTransition(updateDOM);
    } else {
      updateDOM();
    }
  }
}

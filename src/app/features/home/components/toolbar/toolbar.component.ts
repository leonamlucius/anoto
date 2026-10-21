import {
  Component,
  signal,
  ChangeDetectorRef,
  inject,
  OnInit,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NoteService } from '../../services/note.service';
import { FolderService } from '../../services/folder.service';

@Component({
  selector: 'app-toolbar',
  imports: [AsyncPipe],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit {
  constructor(
    protected noteService: NoteService,
    protected folderService: FolderService,
  ) {}
  public activeAction = signal<boolean>(false);
  public activeItem = signal<'date' | 'notes' | string | null>(null);

  public activeView = signal<'notes' | 'list'>('notes');

  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.folderService.showModal$.subscribe((show: boolean) => {
      if (!show) {
        this.activeItem.set(null);
        this.activeAction.set(false);
      }
    });
  }

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

    {
      label: 'new-folder',
      icon: `<span class="material-symbols-outlined">
      create_new_folder
      </span>`,
      description: 'Criar nova pasta',
    },
  ];

  public setActiveItem(item: 'date' | 'notes' | string | null) {
    if (this.activeItem() === item) {
      setTimeout(() => {
        this.activeAction.set(false);
      }, 300);

      this.activeItem.set(null);
    } else {
      if (item === 'new-folder') {
        this.activeItem.set(item);
        this.folderService.setShowModal(true);
        return;
      }
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

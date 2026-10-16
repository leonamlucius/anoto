import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef,
  signal,
} from '@angular/core';
import { finalize, switchMap, tap, map } from 'rxjs/operators';
import { NoteService } from '../../services/note.service';
import { FolderService } from '../../services/folder.service';
import { combineLatest, firstValueFrom } from 'rxjs';
import { DeleteComponent } from '../../../../shared/components/delete/delete.component';
import { Note } from '../../models/note';
import { AsyncPipe } from '@angular/common';
import { DeleteService } from '../../../../shared/services/delete.service';

@Component({
  selector: 'app-actionbar',
  imports: [DeleteComponent, AsyncPipe],
  templateUrl: './actionbar.component.html',
  styleUrls: ['./actionbar.component.scss'],
})
export class ActionbarComponent implements OnInit {
  public actionbarActive: boolean = false;

  public exiting: boolean = false;

  public numberSelected: number = 0;

  private cdr = inject(ChangeDetectorRef);

  public colorPaletteActive: boolean = false;

  public hideColor: boolean = false;

  selectedColor: string | null = null;

  selectedIds: { id: number; color: string | null }[] = [];

  currentColor: string | null = null;

  allfolders: any[] = [];

  selectedFolderId: number[] = [];

  windowActive: string | 'folder' | 'color' | 'delete' = '';

  selectedFolderCheck: number[] = [];

  public isLoading: boolean = false;

  colors = [
    { color: '#FFF176' },
    { color: '#F48FB1' },
    { color: '#A5D6A7' },
    { color: '#90CAF9' },
    { color: '#FFCC80' },
    { color: '#CE93D8' },
  ];

  constructor(
    protected noteService: NoteService,
    protected folderService: FolderService,
    protected deleteService: DeleteService,
  ) {}

  ngOnInit() {
    this.noteService.actionbarActive$
      .pipe(
        tap((active) => {
          if (!active) {
            this.closeActionbar();
            return;
          }

          this.exiting = false;
          this.actionbarActive = active;
        }),
      )
      .subscribe();

    combineLatest([
      this.noteService.numberSelected$,
      this.folderService.numberSelected$,
    ])
      .pipe(map(([notes, folders]) => notes + folders))
      .subscribe((total) => {
        this.numberSelected = total;
      });
    this.noteService.selectedNoteAction$
      .pipe(
        tap((selectedNotes) => {
          this.selectedIds = selectedNotes.map((note) => ({
            id: note.id,
            color: note.color,
          }));
          this.showCheck(selectedNotes);
          // this.updateSelectedFolder();
        }),
      )
      .subscribe();

    this.folderService.folders$
      .pipe(
        tap((folders) => {
          this.allfolders = folders;
          // this.updateSelectedFolder();
        }),
      )
      .subscribe();
  }

  public setIsLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  public showCheck(selectedNotes: Note[]) {
    this.currentColor = selectedNotes[0]?.color ?? null;

    this.selectedColor = selectedNotes.every(
      (note) => note.color === this.currentColor,
    )
      ? this.currentColor
      : null;
  }

  public linkFolder(): void {
    this.setIsLoading(true);
    this.folderService
      .LinkFolder(
        this.selectedFolderId[0],
        this.selectedIds.map((note) => note.id),
      )
      .subscribe(() => {
        this.setIsLoading(false);
        this.noteService.setSelectedNoteAction([]);
        this.selectedFolderId = [];
        this.noteService.setActionbarActive(false);
        this.windowActive = '';
      });
  }
  public selectFolder(folder: any): void {
    const ids = this.selectedIds.map((note) => note.id);
    if (ids.length === 0) return;

    if (this.selectedFolderId.includes(folder.id)) {
      this.selectedFolderId = this.selectedFolderId.filter(
        (id) => id !== folder.id,
      );
      return;
    }
    this.selectedFolderId.push(folder.id);
  }

  public showFolders(): void {
    this.windowActive = this.windowActive === 'folder' ? '' : 'folder';
  }
  public selectColor(color: string): void {
    this.selectedColor = color;

    this.selectedIds.forEach((note) => {
      this.noteService
        .Patchnote(note.id, null, null, this.selectedColor)
        .pipe(
          switchMap(() => this.noteService.Allnotes()),
          finalize(() => {}),
        )
        .subscribe();
    });
  }

  public hideColorPalette(): void {
    this.hideColor = true;

    setTimeout(() => {
      this.windowActive = '';
      this.hideColor = false;
    }, 200);
  }

  public showColorPalette(): void {
    if (this.windowActive === 'color') {
      this.hideColorPalette();
      return;
    }

    this.hideColor = false;
    this.windowActive = 'color';
  }

  public createModalDelete() {
    const selectedIdsNotes = this.noteService
      .getSelectedNoteActions()
      .map((note) => note.id);

    const selectedIdsFolders = this.folderService
      .getSelectedFolderCheck()
      .map((id) => id);

    if (selectedIdsNotes.length === 0 && selectedIdsFolders.length === 0)
      return;

    this.windowActive = 'delete';

    this.noteService.setDeleteNote(selectedIdsNotes);
    this.folderService.setFolderDeleted(selectedIdsFolders);
    this.deleteService.setShowDeleteModal(true);
  }

  public async fixNote() {
    const selectedIds = this.noteService.getSelectedNoteActions();

    if (selectedIds.length === 0) return;

    this.noteService.trueShowOtherView();

    this.cdr.detectChanges();

    await Promise.all(
      selectedIds.map(async (noteId) => {
        console.log('Fixing note with ID:', noteId);
        await firstValueFrom(this.noteService.FixNote(noteId.id));
      }),
    );

    const notes = await firstValueFrom(this.noteService.FetchNotes());

    const updateDOM = async () => {
      this.noteService.setNotes(notes);
      this.cdr.detectChanges();
      this.closeActionbar();
    };

    if ('startViewTransition' in document) {
      (document as any).startViewTransition(updateDOM);
    } else {
      await updateDOM();
    }
  }

  public closeActionbar() {
    this.exiting = true;

    setTimeout(() => {
      this.actionbarActive = false;
      this.exiting = false;
      this.noteService.setSelectedNoteAction([]);
      this.noteService.setNumberSelected(0);
      this.folderService.setSelectedFolderCheck([]);
      this.folderService.setFolderDeleted([]);
      this.folderService.setSelectedFolderLength(0);
      this.numberSelected = 0;
    }, 200);

    this.hideColorPalette();
  }

  public regularizeText(num: number): string {
    let numberString = num.toString();

    let pluralNotes = 'item';

    if (num >= 2) {
      pluralNotes = 'itens';
      return ' ' + pluralNotes + ' selecionadas';
    }
    return ' ' + pluralNotes + ' selecionado';
  }

  public regularizeNumber(num: number): string {
    if (num > 9) {
      return '+ 9';
    }
    return num.toString();
  }
}

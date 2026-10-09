import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef,
  signal,
} from '@angular/core';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { NoteService } from '../../services/note.service';
import { firstValueFrom } from 'rxjs';
import { DeleteComponent } from '../../../../shared/components/delete/delete.component';
import { Note } from '../../models/note';
import { AsyncPipe } from '@angular/common';

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

  selectedNoteId: Note[] = [];

  selectedColor: string | null = null;

  selectedIds: { id: number; color: string | null }[] = [];

  currentColor: string | null = null;

  colors = [
    { color: '#FFF176' },
    { color: '#F48FB1' },
    { color: '#A5D6A7' },
    { color: '#90CAF9' },
    { color: '#FFCC80' },
    { color: '#CE93D8' },
  ];

  constructor(protected noteService: NoteService) {}

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

    this.noteService.numberSelected$
      .pipe(
        tap((numberSelected) => {
          this.numberSelected = numberSelected;
        }),
      )
      .subscribe();

    this.noteService.selectedNoteAction$
      .pipe(
        tap((selectedNotes) => {
          this.selectedIds = selectedNotes.map((note) => ({
            id: note.id,
            color: note.color,
          }));
          this.showCheck(selectedNotes);
        }),
      )
      .subscribe();
  }

  public showCheck(selectedNotes: Note[]) {
    this.currentColor = selectedNotes[0]?.color ?? null;

    this.selectedColor = selectedNotes.every(
      (note) => note.color === this.currentColor,
    )
      ? this.currentColor
      : null;
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
      this.colorPaletteActive = false;
      this.hideColor = false;
    }, 200);
  }

  public showColorPalette(): void {
    if (this.colorPaletteActive) {
      this.hideColorPalette();
      return;
    }

    this.hideColor = false;
    this.colorPaletteActive = true;
  }

  public createModalDelete() {
    const selectedIds = this.noteService
      .getSelectedNoteActions()
      .map((note) => note.id);

    if (selectedIds.length === 0) return;

    this.noteService.setDeleteNote(selectedIds);
    this.noteService.setShowDeleteModal(true);
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
    }, 200);

    this.hideColorPalette();
  }

  public regularizeText(num: number): string {
    let numberString = num.toString();

    let pluralNotes = 'nota';

    if (num > 9) {
      numberString = '+' + numberString;
    }

    if (num >= 2) {
      pluralNotes = 'notas';
      return numberString + ' ' + pluralNotes + ' selecionadas';
    }
    return numberString + ' ' + pluralNotes + ' selecionada';
  }
}

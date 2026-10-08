import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef,
  signal,
} from '@angular/core';
import { tap } from 'rxjs/operators';
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

  selectedNoteId: Note[] = [];


  constructor(protected noteService: NoteService) {}

  ngOnInit() {
    this.noteService.actionbarActive$
      .pipe(
        tap((active) => {
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
      this.closeActionbar(false);
    };

    if ('startViewTransition' in document) {
      (document as any).startViewTransition(updateDOM);
    } else {
      await updateDOM();
    }
  }

  public closeActionbar(active: boolean) {
    this.exiting = true;
    setTimeout(() => {
      this.noteService.setActionbarActive(active);
      this.noteService.setSelectedNoteAction([]);
      this.exiting = false;
    }, 200);
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

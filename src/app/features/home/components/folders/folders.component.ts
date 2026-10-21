import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { FolderService } from '../../services/folder.service';
import { NoteService } from '../../services/note.service';
import { tap } from 'rxjs';
import { Note } from '../../models/note';
import { AsyncPipe } from '@angular/common';
import { DeleteService } from '../../../../shared/services/delete.service';
import { Folder } from '../../models/folder';
@Component({
  selector: 'app-folders',
  imports: [AsyncPipe],
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss'],
})
export class FoldersComponent implements OnInit {
  constructor(
    protected folderService: FolderService,
    private noteService: NoteService,
    private deleteService: DeleteService,
  ) {}

  public folders: any[] = [];

  public selectedestFolderId: number[] = [];

  public noteById: { folderId: number; notes: Note[] }[] = [];

  public mouseOveredFolderId: number | null = null;

  public selectedFolderEdit: Folder[] = [];

  public selectedFolderIdEdit: number | null = null;

  private cdr = inject(ChangeDetectorRef);

  public changedInput: boolean = false;

  public selectedColor: string = '';

  public showConfirmation: boolean = false;

  public noteIdToDelete: number | null = null;

  public showFolders: boolean = true;

  longPressTimeout: any;

  notes = [
    { color: '#FFF176' },
    { color: '#F48FB1' },
    { color: '#A5D6A7' },
    { color: '#90CAF9' },
    { color: '#FFCC80' },
    { color: '#CE93D8' },
  ];

  ngOnInit(): void {
    this.folderService
      .AllFolders()
      .pipe()
      .subscribe({
        error: (error) => {
          console.error('Error fetching folders:', error);
        },
      });

    this.folderService.folders$.subscribe((folders) => {
      this.folders = folders;
      this.folders.forEach((folder) => {
        this.getNotesById([folder]);
      });
    });
  }

  public toggleShowFolders(): void {
    this.showFolders = !this.showFolders;
  }

  public showConfirmationDialog(
    value: boolean,
    NoteId: number | null = null,
  ): void {
    this.showConfirmation = value;
    if (!value) {
      this.noteIdToDelete = null;
      return;
    }
    this.noteIdToDelete = NoteId;
  }

  public filterNotes(folderId: number): void {
    this.noteById = this.noteById.map((item) => {
      if (item.folderId === this.selectedFolderEdit[0]?.id) {
        item.notes = item.notes.filter((note) => note.id !== folderId);
      }
      return item;
    });

    console.log('Filtered notes for folderId:', this.noteById);

    this.changeInput(true);
    this.showConfirmationDialog(false);
  }

  public setSelectedColor(color: string): void {
    this.changeInput(true);
    this.selectedColor = color;
  }

  public updateFolder(
    folderId: number,
    title: string,
    description: string,
    color: string,
    noteIds: number[],
  ): void {
    const data = { title, description, color, noteIds };
    this.folderService.PutFolder(folderId, data).subscribe({
      error: (error) => {
        console.error('Error updating folder:', error);
      },
      complete: () => {
        this.changeInput(false);
      },
    });
  }

  public changeInput(value: boolean): void {
    this.changedInput = value;
  }
  public formatDate(date: string | any, includeHour: boolean = false): any {
    if (!date) return null;
    let dateString = date?.slice(0, 10) || '';

    let actualDate: string = new Date().toISOString().slice(0, 10);

    let day = parseInt(dateString?.slice(8, 10) || '0', 10);
    let month = parseInt(dateString?.slice(5, 7) || '0', 10);
    let year = parseInt(date?.slice(0, 6) || '0', 10);

    let hour = parseInt(date?.slice(11, 13) || '0', 10);
    let minute = parseInt(date?.slice(14, 16) || '0', 10);

    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');

    const today = new Date();
    const yesterday = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate() - 1,
      ),
    );

    const yesterdayString = yesterday.toISOString().slice(0, 10);

    if (dateString === yesterdayString) {
      if (includeHour) {
        return `Ontem às ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      }
      return 'Ontem';
    }

    if (dateString === actualDate) {
      if (includeHour) {
        return `Hoje às ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      }
      return 'Hoje';
    }

    if (month < new Date().getMonth() + 1) {
      if (includeHour) {
        return `${formattedDay}/${formattedMonth}/${year} às ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      }
      return `${formattedDay}/${formattedMonth}/${year}`;
    }

    const weekday = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
    }).format(new Date(year, month - 1, day));

    if (includeHour) {
      return `${weekday.slice(0, 3).charAt(0).toUpperCase()}${weekday.slice(1, 3)}, ${formattedDay}/${formattedMonth} às ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    return `${weekday.slice(0, 3).charAt(0).toUpperCase()}${weekday.slice(1, 3)}, ${formattedDay}/${formattedMonth}`;
  }
  public closeFolderEdit(title: string, description: string): void {
    if (this.changedInput) {
      this.updateFolder(
        this.selectedFolderEdit[0].id,
        title,
        description,
        this.selectedColor,
        this.noteById
          .find((item) => item.folderId === this.selectedFolderEdit[0].id)
          ?.notes.map((note) => note.id) || [],
      );
    }

    const updateDOM = () => {
      this.selectedFolderEdit = [];
      this.cdr.detectChanges();
    };

    if ('startViewTransition' in document) {
      const transition = (document as any).startViewTransition(updateDOM);
      transition.finished.then(() => {
        this.selectedFolderIdEdit = null;
        this.cdr.detectChanges();
      });
    } else {
      updateDOM();
      this.selectedFolderIdEdit = null;
    }
  }

  public showFolderEdit(folder: Folder): void {
    const selectedActions = this.noteService.getSelectedNoteActions();

    const selectecFolder = this.folderService.getSelectedFolderCheck();

    if (selectecFolder.length > 0 || selectedActions.length > 0) {
      this.setSelectedFolderCheckToggle(folder.id);
      return;
    }

    this.noteService.falseShowOtherView();
    this.selectedFolderIdEdit = folder.id;
    this.cdr.detectChanges();

    const updateDOM = () => {
      this.selectedFolderEdit = [folder];
      this.selectedColor = folder.color;
      this.cdr.detectChanges();
    };

    if ('startViewTransition' in document) {
      (document as any).startViewTransition(updateDOM);
    } else {
      updateDOM();
    }
  }

  public deleteFolder(id: number): void {
    if (id != null) {
      this.folderService.setFolderDeleted([id]);

      this.deleteService.setShowDeleteModal(true);
    }
  }

  public cancelSelectedFolderCheck(): void {
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }
  }
  public setSelectedFolderCheck(id: number, event: PointerEvent): void {
    if (event.pointerType != 'touch') {
      return;
    }

    const selectedFolderCheck = this.folderService.getSelectedFolderCheck();

    if (selectedFolderCheck.includes(id)) {
      return;
    }

    this.cancelSelectedFolderCheck();
    this.longPressTimeout = setTimeout(() => {
      this.folderService.toggleSelectedFolderCheck(id);

      this.noteService.setActionbarActive(true);

      this.longPressTimeout = null;
    }, 600);
  }
  public setSelectedFolderCheckToggle(id: number): void {
    const selectedFolderCheck = this.folderService.getSelectedFolderCheck();

    if (selectedFolderCheck.some((folderId: number) => folderId === id)) {
      const updatedSelectedFolderCheck = selectedFolderCheck.filter(
        (folderId: number) => folderId !== id,
      );

      this.folderService.toggleSelectedFolderCheck(id);

      if (
        updatedSelectedFolderCheck.length === 0 &&
        !this.noteService.hasSelectedNoteAction()
      ) {
        this.noteService.setActionbarActive(false);
      }
      return;
    }

    this.folderService.toggleSelectedFolderCheck(id);

    this.noteService.setActionbarActive(true);
  }

  public setFalseMouseOveredFolder(): void {
    this.mouseOveredFolderId = null;
  }

  public setTrueMouseOveredFolder(id: number): void {
    this.mouseOveredFolderId = id;
  }

  public getNotesById(folderId: any[]): void {
    console.log('Fetching notes for folder IDs:', folderId);

    this.noteService.allNotesObservable$.subscribe((notes) => {
      folderId.forEach((folderIdItem) => {
        const folderNotes = notes.filter((note) =>
          folderIdItem.noteIds.includes(note.id),
        );
        const existingIndex = this.noteById.findIndex(
          (item) => item.folderId === folderIdItem.id,
        );
        if (existingIndex !== -1) {
          this.noteById[existingIndex].notes = folderNotes;
        } else {
          if (folderNotes.length > 0) {
            this.noteById.push({
              folderId: folderIdItem.id,
              notes: folderNotes,
            });
          }
        }
      });
    });

    console.log(this.noteById);
  }
}

import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FolderService } from '../../services/folder.service';
import { NoteService } from '../../services/note.service';
import { tap } from 'rxjs';
import { Note } from '../../models/note';
import { AsyncPipe } from '@angular/common';
import { DeleteService } from '../../../../shared/services/delete.service';
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

  public deleteFolder(id: number): void {
    if (id != null) {
      this.folderService.setFolderDeleted([id]);

      this.deleteService.setShowDeleteModal(true);
    }
  }

  public setSelectedFolderCheck(id: number): void {
    const selectedFolderCheck = this.folderService.getSelectedFolderCheck();

    if (selectedFolderCheck.some((folderId: number) => folderId === id)) {
      const updatedSelectedFolderCheck = selectedFolderCheck.filter(
        (folderId: number) => folderId !== id,
      );

      this.folderService.toggleSelectedFolderCheck(id);

      if (updatedSelectedFolderCheck.length === 0) {
        this.noteService.setActionbarActive(false);
        this.folderService.setSelectedFolderCheck([]);
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

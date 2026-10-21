import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { NoteService } from '../../../features/home/services/note.service';
import { FolderService } from '../../../features/home/services/folder.service';
import { DeleteService } from '../../services/delete.service';

import { Input } from '@angular/core';
import { combineLatest } from 'rxjs';
@Component({
  selector: 'app-delete',
  imports: [AsyncPipe],
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent implements OnInit {
  public noteId: number[] | null = null;

  public folderId: number[] | null = null;

  public textDeleteModal: string | null = null;
  constructor(
    private noteService: NoteService,
    private folderService: FolderService,
    private deleteService: DeleteService,
  ) {}

  ngOnInit() {
    this.noteService.deleteNote$.subscribe((noteId) => {
      this.noteId = noteId;
    });
    this.folderService.folderDeleted$.subscribe((folderId) => {
      this.folderId = folderId;
    });

    combineLatest([
      this.noteService.deleteNote$,
      this.folderService.folderDeleted$,
    ])
      .pipe(
        map(([noteId, folderId]) => {
          const lengthNoteId = noteId ? noteId.length : 0;
          const lengthFolderId = folderId ? folderId.length : 0;
          const totalLength = lengthNoteId + lengthFolderId;

          if (lengthNoteId > 0) {
            this.textDeleteModal = `Tem certeza que deseja excluir ${lengthNoteId} nota(s)?`;
          }

          if (lengthFolderId > 0) {
            this.textDeleteModal = `Tem certeza que deseja excluir ${lengthFolderId} pasta(s)?`;
          }

          if (totalLength > lengthNoteId && totalLength > lengthFolderId) {
            this.textDeleteModal = `Tem certeza que deseja excluir ${totalLength} itens`;
          }

          return totalLength;
        }),
      )
      .subscribe();
  }

  public isLoading: boolean = false;

  close() {
    this.deleteService.setShowDeleteModal(false);
    this.noteService.setSelectedNoteAction([]);
    this.noteService.setActionbarActive(false);
  }

  public setLoadingState(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  public async delete() {
    console.log('Deleting notes:', this.noteId);
    console.log('Deleting folders:', this.folderId);

    if (this.isLoading) {
      return;
    }
    if (this.noteId !== null || this.folderId !== null) {
      this.setLoadingState(true);

      if (this.noteId !== null) {
        this.noteId.forEach((id) => {
          this.noteService.Deletenote(id).subscribe(() => {
            this.setLoadingState(false);
            this.noteService.Allnotes().subscribe();
            this.close();
          });
        });
      }

      if (this.folderId !== null) {
        this.folderId.forEach((id) => {
          this.folderService.DeleteFolder(id).subscribe(() => {
            this.setLoadingState(false);
            this.folderService.AllFolders().subscribe();
            this.close();
          });
        });
      }
    }
  }
}

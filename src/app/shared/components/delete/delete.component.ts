import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NoteService } from '../../../features/home/services/note.service';
import { FolderService } from '../../../features/home/services/folder.service';
import { DeleteService } from '../../services/delete.service';

import { Input } from '@angular/core';
@Component({
  selector: 'app-delete',
  imports: [AsyncPipe],
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent implements OnInit {
  public noteId: number[] | null = null;

  public folderId: number[] | null = null;
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

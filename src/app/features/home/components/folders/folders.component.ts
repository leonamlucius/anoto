import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FolderService } from '../../services/folder.service';
import { tap } from 'rxjs';
@Component({
  selector: 'app-folders',
  imports: [],
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss'],
})
export class FoldersComponent implements OnInit {
  constructor(private folderService: FolderService) {}

  public folders: any[] = [];
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
      });
  }
}

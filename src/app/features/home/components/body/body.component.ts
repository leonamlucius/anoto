import { Component } from '@angular/core';

import { NotesComponent } from '../notes/notes.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { AddComponent } from '../../../../shared/components/add/add.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import {FoldersComponent} from '../folders/folders.component';
import { ModalFolderComponent } from '../../../../shared/components/modal-folder/modal-folder.component';
import {FooterComponent} from '../footer/footer.component';
import { ɵEmptyOutletComponent } from '@angular/router';



@Component({
  selector: 'app-body',
  imports: [NotesComponent, TopbarComponent, AlertComponent, AddComponent, ToolbarComponent, FoldersComponent, ModalFolderComponent, FooterComponent, ɵEmptyOutletComponent],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
})
export class BodyComponent {}

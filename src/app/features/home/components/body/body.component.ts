import { Component } from '@angular/core';

import { NotesComponent } from '../notes/notes.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { AddComponent } from '../../../../shared/components/add/add.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';


@Component({
  selector: 'app-body',
  imports: [NotesComponent, TopbarComponent, AlertComponent, AddComponent, ToolbarComponent],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
})
export class BodyComponent {}

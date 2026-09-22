import { Component } from '@angular/core';

import { NotesComponent } from '../notes/notes.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';


@Component({
  selector: 'app-body',
  imports: [NotesComponent, TopbarComponent, AlertComponent],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
})
export class BodyComponent {}

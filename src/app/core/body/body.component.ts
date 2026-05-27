import { Component } from '@angular/core';
import { TitleComponent } from '../title/title.component';
import { NotesComponent } from '../notes/notes.component';
import {AlertComponent} from "../../features/modal/alert/alert.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-body',
  imports: [TitleComponent, NotesComponent, AlertComponent, NgIf],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {


}

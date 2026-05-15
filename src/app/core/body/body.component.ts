import { Component } from '@angular/core';
import { TitleComponent } from '../title/title.component';
import { NotesComponent } from '../notes/notes.component';

@Component({
  selector: 'app-body',
  imports: [TitleComponent, NotesComponent],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {

}

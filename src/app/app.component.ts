import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from './sidebar/sidebar.component';
import {TitleComponent} from './title/title.component';
import { NotesComponent } from './notes/notes.component';
import { BodyComponent } from './body/body.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, TitleComponent, NotesComponent, BodyComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'anoto';
}

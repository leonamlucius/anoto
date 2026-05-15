import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { TitleComponent } from './core/title/title.component';
import { NotesComponent } from './core/notes/notes.component';
import { BodyComponent } from './core/body/body.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    TitleComponent,
    NotesComponent,
    BodyComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'anoto';
}

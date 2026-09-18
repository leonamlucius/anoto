import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './features/home/components/sidebar/sidebar.component';
import { TitleComponent } from './features/home/components/title/title.component';
import { NotesComponent } from './features/home/components/notes/notes.component';
import { BodyComponent } from './features/home/components/body/body.component';
import { AlertComponent } from './shared/components/alert/alert.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    TitleComponent,
    NotesComponent,
    BodyComponent,
    AlertComponent,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'anoto';
}

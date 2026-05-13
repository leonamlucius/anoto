import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from './sidebar/sidebar.component';
import {TitleComponent} from './title/title.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, TitleComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'anoto';
}

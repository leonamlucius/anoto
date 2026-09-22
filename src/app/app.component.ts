import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './shared/components/alert/alert.component';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    
    AlertComponent,

  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'anoto';
}

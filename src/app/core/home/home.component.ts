import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BodyComponent } from '../body/body.component';

@Component({
  selector: 'app-home',
  imports: [SidebarComponent, BodyComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BodyComponent } from '../body/body.component';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-home',
  imports: [SidebarComponent, BodyComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private servicesService: ServicesService) {}


  ngOnInit(): void {
    this.servicesService.testeToken();
  }
}
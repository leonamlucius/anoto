import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service'; 
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BodyComponent } from '../body/body.component';

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
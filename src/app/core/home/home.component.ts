import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BodyComponent } from '../body/body.component';
import { ServicesService } from '../services.service';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [SidebarComponent, BodyComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private servicesService: ServicesService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    const minutes = 30 * 60 * 1000;

    timer(0, minutes)
      .pipe(
        switchMap(() => {
          return this.servicesService.testToken(token);
        }),
      )
      .subscribe((isValid) => {
        if (!isValid) {
          window.location.href = '/login';
        }
      });
  }
}

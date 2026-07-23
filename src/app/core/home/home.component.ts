import { Component, OnInit, DestroyRef } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BodyComponent } from '../body/body.component';
import { ServicesService } from '../services.service';
import { timer, merge, fromEvent, of } from 'rxjs';
import { switchMap, throttleTime, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [SidebarComponent, BodyComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private servicesService: ServicesService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/login';
      return;
    }

    const minutes = 30 * 60 * 1000;

    const idleCheck$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'click'),
      fromEvent(document, 'scroll'),
    ).pipe(throttleTime(1000), startWith(null));

    const idleLoop$ = idleCheck$.pipe(switchMap(() => timer(minutes, minutes)));

    merge(of(null), idleLoop$)
      .pipe(
        switchMap(() => {
          return this.servicesService.testToken(token);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((isValid: boolean) => {
        if (!isValid) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      });
  }
}

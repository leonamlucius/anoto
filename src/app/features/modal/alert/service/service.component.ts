import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertSubject = new Subject<{ type: 'success' | 'error' | 'warning', message: string }>();
  alert$ = this.alertSubject.asObservable();

  show(type: 'success' | 'error' | 'warning', message: string) {
    console.log(`Alert: [${type}] ${message}`);
    this.alertSubject.next({ type, message });
  }
}
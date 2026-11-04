import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertSubject = new Subject<{
    type: 'success' | 'error' | 'warning';
    message: string;
  }>();
  alert$ = this.alertSubject.asObservable();
  public showAlert = false;

  show(type: 'success' | 'error' | 'warning', message: string) {
    this.showAlert = true;
    this.alertSubject.next({ type, message });

    setTimeout(() => {
      this.showAlert = false;
    }, 4000);
  }
}

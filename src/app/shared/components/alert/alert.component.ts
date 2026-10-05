import { Component, OnInit } from '@angular/core';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  imports: [NgClass],
  template: `
    @if (showAlert) {
      <div class="alert-container">
        @for (alert of alerts; track alert.id) {
          <div [ngClass]="[alert.type, alert.isHiding ? 'hide' : '']">
            <div class="alert-body">
              <div class="icon-container" [innerHTML]="alert.icon"></div>
              {{ alert.message }}

              <button (click)="closeAlert(alert.id)">
                <span [innerHTML]="alert.closeIcon"> </span>
              </button>
            </div>

            <span class="progress-bar"> </span>
          </div>
        }
      </div>
    }
  `,
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  showAlert = false;

  private nextAlertId = 0;

  alerts: {
    id: number;
    type: 'success' | 'error' | 'warning';
    message: string;
    icon: string;
    isHiding: boolean;
    closeIcon: string;
  }[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.alert$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((alert) => {
        const alertId = this.nextAlertId++;
        this.alerts.push({
          id: alertId,
          type: alert.type,
          message: alert.message,
          icon: this.getIcon(alert.type),
          isHiding: false,
          closeIcon: `<span *ngIf="showAlert" class="material-symbols-outlined"> close </span>`,
        });
        this.showAlert = true;
        setTimeout(() => {
          this.closeAlert(alertId);
        }, 5000);
      });
  }

  closeAlert(alertId: number) {
    const alert = this.alerts.find((item) => item.id === alertId);

    if (!alert || alert.isHiding) return;

    alert.isHiding = true;

    setTimeout(() => {
      this.alerts = this.alerts.filter((item) => item.id !== alertId);
      this.showAlert = this.alerts.length > 0;
    }, 400);
  }
  getIcon(type: string) {
    if (type === 'success')
      return '<span class="material-symbols-outlined">check</span>';
    if (type === 'error')
      return '<span class="material-symbols-outlined">error</span>';
    if (type === 'warning')
      return '<span class="material-symbols-outlined">warning</span>';
    return '';
  }
}

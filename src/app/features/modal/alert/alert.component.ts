import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { AlertService } from '../alert/service/service.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-alert',
  imports: [NgClass, NgIf],
  template: `
    <div *ngIf="showAlert" [ngClass]="[type, isHiding ? 'hide' : '']">
      <span [innerHTML]="icon"></span> {{ message }}
    </div>
  `,
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  showAlert = false;
  isHiding = false;
  message = '';
  type: 'success' | 'error' | 'warning' = 'success';
  icon = '';

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.alert$.subscribe((alert) => {
      this.type = alert.type;
      this.message = alert.message;
      this.icon = this.getIcon(alert.type);
      this.isHiding = false;
      this.showAlert = true;
      setTimeout(() => {
        this.isHiding = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 400); // tempo da animação de saída
      }, 3000);
    });
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

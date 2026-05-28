import { Component } from '@angular/core';
import { AlertService } from '../../features/modal/alert/service/service.component';
import { TitleComponent } from '../title/title.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ServicesService } from '../services.service';
import { AlertComponent } from '../../features/modal/alert/alert.component';


@Component({
  selector: 'app-login',
  imports: [TitleComponent, FormsModule, RouterLink, AlertComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  showPassword = false;

  constructor(
    private services: ServicesService,
    private alertService: AlertService,
  ) {}

  public login(email: string, password: string): void {
    const button = document.querySelector(
      '.btn.btn-primary',
    ) as HTMLButtonElement;

    button.disabled = true;

    button.classList.add('loading');

    button.innerHTML = `<span class="material-symbols-outlined">
      progress_activity
      </span>`;
    if (!email || !password) {
      this.alertService.show('error', 'Por favor, preencha todos os campos.');
      button.disabled = false;
      button.classList.remove('loading');
      button.innerHTML = `<span class="material-symbols-outlined">
                        chevron_forward
                    </span>`;
      return;
    }

    this.services.login(email, password).finally(() => {
      button.disabled = false;
      button.classList.remove('loading');
      button.innerHTML = `<span class="material-symbols-outlined">
                        chevron_forward
                    </span>`;
    });
  }
}

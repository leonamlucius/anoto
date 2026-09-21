import { Component, OnDestroy } from '@angular/core';
import { AlertService } from '../../../../shared/services/alert.service';
import { TitleComponent } from '../../../home/components/title/title.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-login',
  imports: [TitleComponent, FormsModule, RouterLink, AlertComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  showPassword = false;

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
  ) {}


  // ngOnDestroy(): void {
  //   this.authService.login('', '').subscribe();
  // }
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

    this.authService.login(email, password).subscribe({
      complete: () => {
        button.disabled = false;
        button.classList.remove('loading');
        button.innerHTML = `<span class="material-symbols-outlined">
                          chevron_forward
                      </span>`;
      }
    });
  }
}

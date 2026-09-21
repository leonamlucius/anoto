import { Component } from '@angular/core';
import { TitleComponent } from '../../../home/components/title/title.component';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-cadastrar',
  imports: [TitleComponent, AlertComponent, RouterLink, NgIf],
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss'],
})
export class CadastrarComponent {
  public isLoading: boolean = false;

  showPassword = false;
  showConfirmPassword = false;
  constructor(
    private authService: AuthService,
    private alertService: AlertService,
  ) {}

  public setLoadingState(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  public register(
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): void {
    if (this.isLoading) {
      return;
    }

    if (password.length < 8 || confirmPassword.length < 8) {
      this.alertService.show(
        'error',
        'A senha deve conter pelo menos 8 caracteres. Por favor, tente novamente.',
      );
      return;
    }
    if (password !== confirmPassword) {
      this.alertService.show(
        'error',
        'As senhas não coincidem. Por favor, tente novamente.',
      );
      return;
    }

    this.setLoadingState(true);
    this.authService.register(name, email, password).subscribe({
      next: () => {
        this.setLoadingState(false);
      },
      error: () => {
        this.setLoadingState(false);
      },
    });
  }
}

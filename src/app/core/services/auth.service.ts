import { Injectable } from '@angular/core';
import { AlertService } from '../../shared/services/alert.service';
import { environment } from '../../../environments/environment';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private alertService: AlertService,
    private ngZone: NgZone,
    private router: Router,
  ) {}

  public async login(email: string, password: string): Promise<void> {
    const apiUrl = environment.apiUrl;
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        this.alertService.show('success', 'Login realizado com sucesso!');
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Login failed:', error);
      this.alertService.show(
        'error',
        'Falha no login. Verifique suas credenciais e tente novamente.',
      );
    }
  }

  public async register(
    name: string,
    email: string,
    password: string,
  ): Promise<void> {
    try {
      const apiUrl = environment.apiUrl;
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error('Register failed');
      }

      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        this.alertService.show('success', 'Cadastro realizado com sucesso!');
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Register failed:', error);
      this.alertService.show(
        'error',
        'Falha no cadastro. Verifique seus dados e tente novamente.',
      );
    }
  }

  public async requestPasswordReset(email: string): Promise<void> {
    const apiUrl = environment.apiUrl;
    try {
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        this.ngZone.run(() => {
          this.alertService.show(
            'error',
            'Falha ao solicitar redefinição de senha. Por favor, tente novamente.',
          );
        });
        throw new Error('Failed to request password reset');
      }

      this.ngZone.run(() => {
        this.alertService.show(
          'success',
          'Email de recuperação enviado com sucesso!',
        );
      });
    } catch (error) {
      console.error('Failed to request password reset:', error);
      this.alertService.show(
        'error',
        'Falha ao solicitar redefinição de senha. Por favor, tente novamente.',
      );
    }
  }

  public async requestToken(token: string, newPassword: string): Promise<void> {
    if (newPassword.length < 8) {
      this.alertService.show(
        'error',
        `A senha deve conter no mínimo 8 caracteres.`,
      );
      return;
    }
    const apiUrl = environment.apiUrl;
    try {
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
      if (!response.ok) {
        this.ngZone.run(() => {
          this.alertService.show(
            'error',
            'Falha ao solicitar redefinição de senha. Por favor, tente novamente.',
          );
        });
        throw new Error('Failed to request password reset');
      }

      this.ngZone.run(() => {
        this.alertService.show('success', 'Senha redefinida com sucesso!');
      });
    } catch (error) {
      console.error('Failed to request password reset:', error);
      this.alertService.show(
        'error',
        'Falha ao redefinir senha. Por favor, tente novamente.',
      );
    }
  }

  public async testToken(token: any): Promise<any> {
    const apiUrl = environment.apiUrl;
    try {
      const response = await fetch(`${apiUrl}/auth/jwtTest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to test token');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to test token:', error);
      this.alertService.show(
        'error',
        'Falha ao testar token. Por favor, tente novamente.',
      );
    }
  }
}

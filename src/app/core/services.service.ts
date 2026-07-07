import { Injectable, inject } from '@angular/core';
import { AlertService } from '../features/modal/alert/service/service.component';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  constructor(
    private alertService: AlertService,
    private ngZone: NgZone,
  ) {}

  notesUpdated$ = new Subject<void>();
  private router = inject(Router);


  public testeToken (): void {
    const token = localStorage.getItem('token');

  if (!token || token === 'undefined') {
    localStorage.removeItem('token');
    this.alertService.show('error', 'Token não encontrado. Por favor, faça login.');
    this.ngZone.run(() => this.router.navigate(['/login']));
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiredAt = payload.exp * 1000; // exp vem em segundos, converte para ms

    if (Date.now() > expiredAt) {
      localStorage.removeItem('token');
      this.alertService.show('error', 'Sessão expirada. Por favor, faça login novamente.');
      this.ngZone.run(() => this.router.navigate(['/login']));
      return;
    }
  } catch {
    localStorage.removeItem('token');
    this.ngZone.run(() => this.router.navigate(['/login']));
  }
  };

  public async login(email: string, password: string): Promise<void> {
    try {
      const response = await fetch('https://hungry-jeans-shop.loca.lt/auth/login', {
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
      const response = await fetch('https://hungry-jeans-shop.loca.lt/auth/register', {
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

  public async Allnotes(): Promise<any[] | void> {
    try {
      const response = await fetch('https://hungry-jeans-shop.loca.lt/notes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      if (response.status === 200) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      this.alertService.show(
        'error',
        'Falha ao buscar notas. Por favor, tente novamente.',
      );
    }
  }

  public async Postnote(
    title: string,
    content: string,
    color: string,
  ): Promise<any[] | void> {
    try {
      const response = await fetch('https://hungry-jeans-shop.loca.lt/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, content, color }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      if (response.status === 201) {
        this.notesUpdated$.next();
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      this.alertService.show(
        'error',
        'Falha ao buscar notas. Por favor, tente novamente.',
      );
    }
  }

  public async Deletenote(id: number): Promise<any[] | void> {
    try {
      const response = await fetch(`https://hungry-jeans-shop.loca.lt/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete notes');
      }

      if (response.status === 204) {
        this.notesUpdated$.next();
      }
    } catch (error) {
      console.error('Failed to delete notes:', error);
      this.alertService.show(
        'error',
        'Falha ao deletar nota. Por favor, tente novamente.',
      );
    }
  }

  public async Putnote(
    id: number,
    title: string,
    content: string,
    color: string,
  ): Promise<any[] | void> {
    try {
      const response = await fetch(`https://hungry-jeans-shop.loca.lt/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, content, color }),
      });
      if (!response.ok) {
        throw new Error('Failed to update notes');
      }

      if (response.status === 204) {
        this.notesUpdated$.next();
      }
    } catch (error) {
      console.error('Failed to update notes:', error);
      this.alertService.show(
        'error',
        'Falha ao atualizar nota. Por favor, tente novamente.',
      );
    }
  }

  public async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await fetch(
        'https://hungry-jeans-shop.loca.lt/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      );
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

    if(newPassword.length < 8) {
      this.alertService.show(
        'error',`A senha deve conter no mínimo 8 caracteres.`
      );
      return;
    }
    try {
      const response = await fetch(
        'https://hungry-jeans-shop.loca.lt/auth/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, newPassword }),
        },
      );
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
          'Senha redefinida com sucesso!',
        );
      });
    } catch (error) {
      console.error('Failed to request password reset:', error);
      this.alertService.show(
        'error',
        'Falha ao redefinir senha. Por favor, tente novamente.',
      );
    }
  }
}

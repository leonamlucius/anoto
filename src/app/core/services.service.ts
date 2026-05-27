import { Injectable, inject } from '@angular/core';
import { AlertService } from '../features/modal/alert/service/service.component';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  constructor(private alertService: AlertService) {}

  notesUpdated$ = new Subject<void>();
  private router = inject(Router);

  public async login(email: string, password: string): Promise<void> {
    try {
      const response = await fetch('https://anoto.onrender.com/auth/login', {
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
      const response = await fetch('https://anoto.onrender.com/auth/register', {
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
      const response = await fetch('https://anoto.onrender.com/notes', {
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
      const response = await fetch('https://anoto.onrender.com/notes', {
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
      const response = await fetch(`https://anoto.onrender.com/notes/${id}`, {
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
      const response = await fetch(`https://anoto.onrender.com/notes/${id}`, {
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
}

import { Injectable, inject } from '@angular/core';
import { AlertService } from '../../shared/services/alert.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { environment } from '../../../environments/environment';

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

  public async Allnotes(): Promise<any[] | void> {
    const apiUrl = environment.apiUrl;
    try {
      const response = await fetch(`${apiUrl}/notes`, {
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
      const apiUrl = environment.apiUrl;
      const response = await fetch(`${apiUrl}/notes`, {
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
    const apiUrl = environment.apiUrl;
    try {
      const response = await fetch(`${apiUrl}/notes/${id}`, {
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
    const apiUrl = environment.apiUrl;
    try {
      const response = await fetch(`${apiUrl}/notes/${id}`, {
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

import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  constructor() {}

  notesUpdated$ = new Subject<void>();
  private router = inject(Router);

  public async login(email: string, password: string): Promise<void> {
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
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
        alert('Login successful!');
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials and try again.');
    }
  }

  public async register(
    name: string,
    email: string,
    password: string,
  ): Promise<void> {
    try {
      const response = await fetch('http://localhost:8080/auth/register', {
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
        alert('Register successful!');
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Register failed:', error);
      alert('Register failed. Please check your credentials and try again.');
    }
  }

  public async Allnotes(): Promise<any[] | void> {
    try {
      const response = await fetch('http://localhost:8080/notes', {
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
      alert('Failed to fetch notes. Please try again.');
    }
  }

  public async Postnote(
    title: string,
    content: string,
    color: string,
  ): Promise<any[] | void> {
    try {
      const response = await fetch('http://localhost:8080/notes', {
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
      alert('Failed to fetch notes. Please try again.');
    }
  }

  public async Deletenote(
   id: number,
  ): Promise<any[] | void> {
    try {
      const response = await fetch(`http://localhost:8080/notes/${id}`, {
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
      alert('Failed to delete notes. Please try again.');
    }
  }

  public async Putnote(
    id: number,
    title: string,
    content: string,
    color: string,
  ): Promise<any[] | void> {
    try {
      const response = await fetch(`http://localhost:8080/notes/${id}`, {
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
      alert('Failed to update notes. Please try again.');
    }
  }
}

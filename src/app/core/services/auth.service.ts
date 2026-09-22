import { Injectable } from '@angular/core';
import { AlertService } from '../../shared/services/alert.service';
import { environment } from '../../../environments/environment';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private alertService: AlertService,
    private ngZone: NgZone,
    private router: Router,
    private http: HttpClient,
  ) {}

  private apiUrl = environment.apiUrl;

  private name = new BehaviorSubject<string>('Leonam Lucius');

  

  public getName(): Observable<string> {
    return this.name.asObservable();
  }

  public setName(name: string): void {
    this.name.next(name);
  }

  public login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.setName(response.name);
          this.alertService.show('success', 'Login realizado com sucesso!');
          this.router.navigate(['/home']);
        }),
        catchError((error) => {
          console.error('Failed to login:', error);
          this.alertService.show(
            'error',
            'Falha no login. Verifique suas credenciais e tente novamente.',
          );
          return of(null);
        }),
      );
  }

  public register(
    name: string,
    email: string,
    password: string,
  ): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/register`, {
        email,
        password,
        name,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.setName(response.name);
          this.alertService.show('success', 'Cadastro realizado com sucesso!');
          this.router.navigate(['/home']);
        }),
        catchError((error) => {
          console.error('Failed to register:', error);
          this.alertService.show(
            'error',
            'Falha no cadastro. Verifique seus dados e tente novamente.',
          );
          return of(null);
        }),
      );
  }

  public requestPasswordReset(email: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/forgot-password`, { email })
      .pipe(
        tap((response) => {
          this.alertService.show(
            'success',
            'Email de recuperação enviado com sucesso!',
          );
        }),

        catchError((error) => {
          console.error('Failed to request password reset:', error);
          this.alertService.show(
            'error',
            'Falha ao solicitar redefinição de senha. Por favor, tente novamente.',
          );
          return of(null);
        }),
      );
  }

  public requestToken(token: string, newPassword: string): Observable<any> {
    if (newPassword.length < 8) {
      this.alertService.show(
        'error',
        `A senha deve conter no mínimo 8 caracteres.`,
      );
      return of(null);
    }

    return this.http
      .post<any>(`${this.apiUrl}/auth/reset-password`, {
        token,
        newPassword,
      })
      .pipe(
        tap((response) => {
          this.alertService.show('success', 'Senha redefinida com sucesso!');
        }),
        catchError((error) => {
          console.error('Failed to request password reset:', error);
          this.alertService.show(
            'error',
            'Falha ao redefinir senha. Por favor, tente novamente.',
          );
          return of(null);
        }),
      );
  }

  public testToken(token: any): Observable<boolean> {
    return this.http
      .post<boolean>(`${this.apiUrl}/auth/jwtTest`, { token })
      .pipe(
        tap((response) => {
          return response;
        }),
        catchError((error) => {
          console.error('Failed to test token:', error);
          this.alertService.show(
            'error',
            'Falha ao testar token. Por favor, tente novamente.',
          );
          return of(false);
        }),
      );
  }
}

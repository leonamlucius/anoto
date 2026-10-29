import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TitleComponent } from '../../../../shared/components/title/title.component';

import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { catchError, finalize } from 'rxjs';

@Component({
  selector: 'app-resetar-senha',
  imports: [FormsModule, ReactiveFormsModule, TitleComponent, RouterModule],
  templateUrl: './resetar-senha.component.html',
  styleUrls: ['./resetar-senha.component.scss'],
})
export class ResetarSenhaComponent {
  form: FormGroup;
  token: string | null = null;
  loading = false;
  error: string | null = null;
  success: boolean = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) {
    this.form = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordsMatchValidator },
    );
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');

    this.authService.testResetPassword(this.token!).subscribe({
      next: () => {
        console.log('Token válido');
      },
      error: (err) => {
        console.error('Token inválido ou expirado', err);
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    return form.get('newPassword')!.value === form.get('confirmPassword')!.value
      ? null
      : { mismatch: true };
  }

  postToken() {
    this.loading = true;
    this.authService
      .requestToken(this.token!, this.form.value.newPassword)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          console.log(err);
          this.error = err.error.error;
        },
      });
  }
}

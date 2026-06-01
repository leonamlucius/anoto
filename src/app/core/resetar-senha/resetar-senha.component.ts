import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TitleComponent } from '../title/title.component';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-resetar-senha',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TitleComponent,
    NgIf,
    RouterModule,
  ],
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
    private servicesService: ServicesService,
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
  }

  passwordsMatchValidator(form: FormGroup) {
    return form.get('newPassword')!.value === form.get('confirmPassword')!.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (!this.token) {
      this.error = 'Token inválido ou ausente.';
      return;
    }
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.error = null;
    this.http
      .post('/api/auth/reset-password', {
        token: this.token,
        newPassword: this.form.value.newPassword,
      })
      .subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.error = err.error?.message ;
          this.loading = false;
        },
      });
  }

  postToken() {
    this.servicesService
      .requestToken(this.token!, this.form.value.newPassword)
      .then(
        () => {
          this.success = true;
          this.loading = false;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        (err) => {
          this.error = err.error?.message;
          this.loading = false;
        },
      );
  }
}

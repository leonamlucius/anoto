import { Component } from '@angular/core';
import { TitleComponent } from '../../../../shared/components/title/title.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-recuperar-senha',
  imports: [TitleComponent, RouterLink, FormsModule],
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss'],
})
export class RecuperarSenhaComponent {
  constructor(private authService: AuthService) {}

  public loading: boolean = false;

  postEmail(email: string) {
    this.loading = true;

    this.authService.requestPasswordReset(email).subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}

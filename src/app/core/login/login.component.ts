import { Component } from '@angular/core';
import { TitleComponent } from '../title/title.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-login',
  imports: [TitleComponent, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  showPassword = false;

  constructor(private services: ServicesService) {}

  public login(email: string, password: string): void {
    if (!email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    this.services.login(email, password);
  }
}

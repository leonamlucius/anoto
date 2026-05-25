import { Component } from '@angular/core';
import { TitleComponent } from '../title/title.component';
import { ServicesService } from '../services.service';
@Component({
  selector: 'app-cadastrar',
  imports: [TitleComponent],
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss'],
})
export class CadastrarComponent {
  showPassword = false;
  showConfirmPassword = false;
  constructor(private services: ServicesService) {}

  public register(
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): void {
    // Implementar lógica de registro aqui


    if(password.length < 8  || confirmPassword.length < 8) {
      alert('A senha deve conter pelo menos 8 caracteres. Por favor, tente novamente.');
      return;
    }
    if (password !== confirmPassword) {
      alert('As senhas não coincidem. Por favor, tente novamente.');
      return;
    }

    this.services.register(name, email, password);

    
  }
}

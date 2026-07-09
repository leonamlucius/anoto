import { Component } from '@angular/core';
import { TitleComponent } from '../title/title.component';
import { NgIf } from '@angular/common';
import { ServicesService } from '../services.service';
import {AlertService} from "../../features/modal/alert/service/service.component";
import { AlertComponent } from '../../features/modal/alert/alert.component';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-cadastrar',
  imports: [TitleComponent, AlertComponent, RouterLink, NgIf],
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss'],
})
export class CadastrarComponent {
  public isLoading: boolean = false;

  showPassword = false;
  showConfirmPassword = false;
  constructor(private services: ServicesService, private alertService: AlertService) {}


  public setLoadingState(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  public register(
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): void {
    if(this.isLoading) {
      return;
    }


    if(password.length < 8  || confirmPassword.length < 8) {
      this.alertService.show('error', 'A senha deve conter pelo menos 8 caracteres. Por favor, tente novamente.');
      return;
    }
    if (password !== confirmPassword) {
      this.alertService.show('error', 'As senhas não coincidem. Por favor, tente novamente.');
      return;
    }

    this.setLoadingState(true);
    this.services.register(name, email, password).finally(() => {
      this.setLoadingState(false);
    });
  }
}

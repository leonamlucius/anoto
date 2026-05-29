import { Routes } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { HomeComponent } from './core/home/home.component';
import { RecuperarSenhaComponent } from './core/recuperar-senha/recuperar-senha.component';
import { CadastrarComponent } from './core/cadastrar/cadastrar.component';
import { ResetarSenhaComponent } from './core/resetar-senha/resetar-senha.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'recuperar-senha', component: RecuperarSenhaComponent },
  { path: 'cadastrar', component: CadastrarComponent },
  { path: 'resetar-senha', component: ResetarSenhaComponent },
];

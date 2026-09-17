import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { HomeComponent } from './features/home/components/home/home.component';
import { RecuperarSenhaComponent } from './features/auth/components/recuperar-senha/recuperar-senha.component';
import { CadastrarComponent } from './features/auth/components/cadastrar/cadastrar.component';
import { ResetarSenhaComponent } from './features/auth/components/resetar-senha/resetar-senha.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'recuperar-senha', component: RecuperarSenhaComponent },
  { path: 'cadastrar', component: CadastrarComponent },
  { path: 'resetar-senha', component: ResetarSenhaComponent },
];

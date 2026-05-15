import { Component } from '@angular/core';
import { TitleComponent } from '../title/title.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [TitleComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  showPassword = false;
}

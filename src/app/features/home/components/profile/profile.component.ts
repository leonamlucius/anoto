import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [AsyncPipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  private authService = inject(AuthService);
  public userName$ = this.authService.getName();
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { catchError, Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { UserDropdownService } from '../../services/user-dropdown.service';

@Component({
  selector: 'app-user-dropdown',
  imports: [AsyncPipe],
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.scss'],
})
export class UserDropdownComponent implements OnInit {
  alertService: any;
  constructor(
    private authService: AuthService,
    protected userDropdownService: UserDropdownService,
  ) {}

  protected name!: string;

  protected email!: string;

  protected icons = [
    {
      name: 'Perfil',
      icon: `<i class="bi bi-person-circle"></i>`,
    },
    {
      name: 'Logout',
      icon: `<i class="bi bi-box-arrow-in-left"></i>`,
    },
  ];
  ngOnInit(): void {
    this.name = localStorage.getItem('name') || '';
    this.email = localStorage.getItem('email') || '';
  }

  public logOut(): void {
    this.authService
      .logout()
      .pipe(
        catchError((error) => {
          console.error('Failed to logout:', error);
          this.alertService.show(
            'error',
            'Falha ao realizar logout. Por favor, tente novamente.',
          );
          return of(null);
        }),
      )
      .subscribe();
  }
}

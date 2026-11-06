import {
  Component,
  OnInit,
  OnDestroy,
  ApplicationRef,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { UserDropdownService } from '../../services/user-dropdown.service';
import { ProfileComponent } from '../../components/profile/profile.component';
import { AlertService } from '../../../../shared/services/alert.service';
import { Info } from '../../models/info';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-dropdown',
  imports: [AsyncPipe, ProfileComponent, FormsModule],
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.scss'],
})
export class UserDropdownComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    protected userDropdownService: UserDropdownService,
    private alertService: AlertService,
  ) {}


  private appRef = inject(ApplicationRef);

  protected name!: string;

  protected email!: string;

  protected emailInput!: string;

  protected nameInput!: string;

  protected icons = [
    {
      name: 'Perfil',
      action: () => this.activateSectionToggle('profile'),
      icon: `<i class="bi bi-person-circle"></i>`,
      chevron: `<span class="material-symbols-outlined">
      keyboard_arrow_up
      </span>`,
    },
    {
      name: 'Logout',
      action: () => this.logOut(),
      icon: `<i class="bi bi-box-arrow-in-left"></i>`,
    },
  ];

  protected activedSectiosnToogle: 'profile' | 'logout' | null = null;

  protected activedSectiosnHover: 'profile' | 'logout' | null = null;

  protected showmodal: boolean = false;

  private alreadyUpdated: boolean = false;

  ngOnInit(): void {
    this.userDropdownService.showDropdown$
      .pipe(
        tap((show) => {
          this.showmodal = show;
        }),
      )
      .subscribe((show) => {
        if (!show) {
          this.activedSectiosnHover = null;
          this.activedSectiosnToogle = null;
        }
      });

    this.userDropdownService.getInfo().subscribe((info) => {
      this.name = info.name;
      this.email = info.email;

      this.emailInput = info.email;
      this.nameInput = info.name;
    });
  }

  ngOnDestroy(): void {
    this.userDropdownService.setDropdown(false);
  }

  public markAsUpdated(): void {
    this.alreadyUpdated = true;
  }

  public updateInfo(info: Info): void {
    this.userDropdownService
      .updateInfo(info)
      .pipe(
        tap((data) => {
          this.name = data.name;
          this.email = data.email;
          this.nameInput = data.name;
          this.emailInput = data.email;
        }),
        finalize(() => {
          this.alreadyUpdated = false;
        }),
      )
      .subscribe();
  }

  public deactivateAll(): void {
    if (this.alreadyUpdated) {
      this.updateInfo({ name: this.nameInput, email: this.emailInput });
    }

    const updateDOM = () => {
      this.activedSectiosnToogle = null;
      this.activedSectiosnHover = null;
      this.userDropdownService.setDropdown(false);
      this.appRef.tick();
    };
    if ('startViewTransition' in document) {
      const transition = (document as any).startViewTransition(updateDOM);
    } else {
      updateDOM();
    }
  }

  public activateSectionHover(section: 'profile' | 'logout'): void {
    if (this.activedSectiosnHover || this.activedSectiosnToogle) {
      this.activedSectiosnHover = null;
      return;
    }
    this.activedSectiosnHover = section;
  }

  public activateSectionToggle(section: 'profile' | 'logout'): void {
    if (this.activedSectiosnToogle) {
      this.activedSectiosnToogle = null;

      return;
    }
    this.activedSectiosnToogle = section;
  }

  public logOut(): void {
    this.authService
      .logout()
      .pipe(
        catchError((error) => {
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

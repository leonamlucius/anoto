import { Component } from '@angular/core';
import { TitleComponent } from '../../../../shared/components/title/title.component';
import { ProfileComponent } from '../../../home/components/profile/profile.component';
import { NoteService } from '../../../home/services/note.service';
import { inject, effect, ChangeDetectorRef } from '@angular/core';
import { ɵEmptyOutletComponent } from '@angular/router';
import { SearchComponent } from '../search/search.component';
import { SearchService } from '../../services/search.service';
import { UserDropdownComponent } from '../user-dropdown/user-dropdown.component';
import { UserDropdownService } from '../../services/user-dropdown.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-topbar',
  imports: [
    TitleComponent,
    ProfileComponent,
    ɵEmptyOutletComponent,
    SearchComponent,
    UserDropdownComponent,
    AsyncPipe,
  ],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  public progressActivityVisible: boolean = true;

  private cdr = inject(ChangeDetectorRef);

  constructor(
    protected noteService: NoteService,
    protected searchService: SearchService,
    protected userDropdownService: UserDropdownService,
  ) {
    effect(() => {
      this.progressActivityVisible = this.noteService.loading();
    });
    ('');
  }

  public showUserDropdown(): void {

    this.noteService.trueShowOtherView();
    const updateDOM = () => {
      
      this.userDropdownService.toggleDropdown();
      this.cdr.detectChanges();
    };

    if ('startViewTransition' in document) {
      const transition = (document as any).startViewTransition(updateDOM);
    } else {
      updateDOM();
    }
  }
}

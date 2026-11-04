import { Component } from '@angular/core';
import { TitleComponent } from '../../../../shared/components/title/title.component';
import { ProfileComponent } from '../../../home/components/profile/profile.component';
import { NoteService } from '../../../home/services/note.service';
import { inject, effect } from '@angular/core';
import { ɵEmptyOutletComponent } from '@angular/router';
import { SearchComponent } from '../search/search.component';
import { SearchService } from '../../services/search.service';
import { UserDropdownComponent } from '../user-dropdown/user-dropdown.component';
import { UserDropdownService } from '../../services/user-dropdown.service';

@Component({
  selector: 'app-topbar',
  imports: [
    TitleComponent,
    ProfileComponent,
    ɵEmptyOutletComponent,
    SearchComponent,
    UserDropdownComponent,  
  ],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  public progressActivityVisible: boolean = true;

  constructor(
    private noteService: NoteService,
    protected searchService: SearchService,
    protected userDropdownService: UserDropdownService,
  ) {
    effect(() => {
      this.progressActivityVisible = this.noteService.loading();
    });
  }
}

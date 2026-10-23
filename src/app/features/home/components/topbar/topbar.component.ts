import { Component } from '@angular/core';
import { TitleComponent } from '../../../../shared/components/title/title.component';
import { ProfileComponent } from '../../../home/components/profile/profile.component';
import { NoteService } from '../../../home/services/note.service';
import { inject, effect } from '@angular/core';
import { ɵEmptyOutletComponent } from '@angular/router';
import { SearchComponent } from '../../../../shared/components/search/search.component';
@Component({
  selector: 'app-topbar',
  imports: [TitleComponent, ProfileComponent, ɵEmptyOutletComponent, SearchComponent],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  public progressActivityVisible: boolean = true;

  constructor(private noteService: NoteService) {
    effect(() => {
      this.progressActivityVisible = this.noteService.loading();
    });
  }
}

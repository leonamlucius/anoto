import { Component } from '@angular/core';
import { TitleComponent } from '../../../home/components/title/title.component';
import { ProfileComponent } from '../../../home/components/profile/profile.component';
import { NoteService } from '../../../home/services/note.service';
import { inject, effect } from '@angular/core';
import { ɵEmptyOutletComponent } from '@angular/router';
@Component({
  selector: 'app-topbar',
  imports: [TitleComponent, ProfileComponent, ɵEmptyOutletComponent],
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

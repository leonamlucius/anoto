import { Component, signal, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { UserDropdownService } from '../../services/user-dropdown.service';

@Component({
  selector: 'app-profile',
  imports: [AsyncPipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profilePhoto = '/img/blank-profile-picture-973460_960_720.png';
  constructor(protected userDropdownService: UserDropdownService) {}

  ngOnInit(): void {
    this.userDropdownService.profilePhoto$.subscribe((photo) => {
      if (photo) {
        this.profilePhoto = `data:${photo.contentType};base64,${photo.base64Data}`;
      }
    });

    this.userDropdownService.getProfilePhoto().subscribe();
  }
}

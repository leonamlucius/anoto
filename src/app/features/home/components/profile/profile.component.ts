import { Component, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { UserDropdownService } from '../../services/user-dropdown.service';

@Component({
  selector: 'app-profile',
  imports: [AsyncPipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
}

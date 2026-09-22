import { Component } from '@angular/core';
import { TitleComponent } from '../../../home/components/title/title.component';
import { ProfileComponent } from '../../../home/components/profile/profile.component';
@Component({
  selector: 'app-topbar',
  imports: [TitleComponent, ProfileComponent],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {

}

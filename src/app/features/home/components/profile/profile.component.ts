import { Component, signal } from '@angular/core';
import { InfoService } from '../../../../features/home/services/info.service';
import { AsyncPipe } from '@angular/common';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Info } from '../../../../features/home/models/info';

@Component({
  selector: 'app-profile',
  imports: [AsyncPipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(private infoService: InfoService) {}

  protected profileExpanded = signal<boolean>(false);

  protected userName$!: Observable<Info>;

  
  ngOnInit(): void {
    this.infoService.getInfo('1').subscribe();
    this.userName$ = this.infoService.getName();
  }


  public toggleProfileExpanded(): void {
    this.profileExpanded.set(!this.profileExpanded());
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserDropdownService {
  private showDropdown = new BehaviorSubject<boolean>(false);

  public showDropdown$ = this.showDropdown.asObservable();

  public toggleDropdown(): void {
    this.showDropdown.next(!this.showDropdown.value);
  }
}

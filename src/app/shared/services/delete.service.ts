import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeleteService {
  private showDeleteModalSubject = new BehaviorSubject<boolean>(false);
  public showDeleteModal$ = this.showDeleteModalSubject.asObservable();

  public setShowDeleteModal(show: boolean) {
    this.showDeleteModalSubject.next(show);
  }
}

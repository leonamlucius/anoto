import { Component } from '@angular/core';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-add',
  imports: [ModalComponent],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent {

  showModal = false;

  createModal() {
    this.showModal = true;
  }

}

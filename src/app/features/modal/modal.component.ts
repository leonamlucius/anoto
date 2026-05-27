import { Component, EventEmitter, Output } from '@angular/core';
import { NgFor } from '@angular/common';
import { ServicesService } from '../../core/services.service';
import { Input, OnInit } from '@angular/core';
import { AlertService } from './alert/service/service.component';

@Component({
  selector: 'app-modal',
  imports: [NgFor],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  constructor(private services: ServicesService, private alertService: AlertService) {}
  title: string = 'teste';
  message: string = 'teste';

  @Output() closeModal = new EventEmitter<void>();

  notes = [
    { id: 1, title: 'Note 1', content: 'Content of Note 1', color: '#FFF176' },
    { id: 2, title: 'Note 2', content: 'Content of Note 2', color: '#F48FB1' },
    { id: 3, title: 'Note 3', content: 'Content of Note 3', color: '#A5D6A7' },
    { id: 4, title: 'Note 4', content: 'Content of Note 4', color: '#90CAF9' },
    { id: 5, title: 'Note 5', content: 'Content of Note 5', color: '#FFCC80' },
    { id: 6, title: 'Note 6', content: 'Content of Note 6', color: '#CE93D8' },
  ];

  close() {
    this.closeModal.emit();
  }

  @Input() note: any = null;
  selectedColor: string = '';

  ngOnInit() {
    if (this.note) {
      this.selectedColor = this.note.color;
    }
  }
  public selectNote(event: MouseEvent, color: string) {
    const clicked = event.currentTarget as HTMLElement;

    if (clicked.classList.contains('active')) {
      clicked.classList.remove('active');
      this.selectedColor = '';
      return;
    }

    document
      .querySelectorAll('.color-option')
      .forEach((n) => n.classList.remove('active'));
    clicked.classList.add('active');
    this.selectedColor = color; // ← salva o hex direto
  }

  public PostNote(title: string, description: string): void {


    if (!title.trim() || !description.trim()) {
      this.alertService.show('error', 'Título e descrição não podem ser vazios!');
      return;
    }
    if (!this.selectedColor) {
      this.alertService.show('error', 'Selecione uma cor para a nota!');
      return;
    }

    if (this.note) {
      // edição
      this.services
        .Putnote(this.note.id, title, description, this.selectedColor)
        .then(() => this.close());
    } else {
      // criação
      this.services
        .Postnote(title, description, this.selectedColor)
        .then(() => this.close());
    }
  }

  public selectColor(color: string) {
    this.selectedColor = this.selectedColor === color ? '' : color;
  }
}

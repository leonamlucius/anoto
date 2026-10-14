import { Component, EventEmitter, Output } from '@angular/core';

import { NoteService } from '../../../features/home/services/note.service';
import { Input, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { catchError, EMPTY, finalize, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  public isLoading: boolean = false;

  constructor(
    private noteService: NoteService,
    private alertService: AlertService,
  ) {}
  title: string = 'teste';
  message: string = 'teste';

  @Output() closeModal = new EventEmitter<void>();

  notes = [
    { color: '#FFF176' },
    { color: '#F48FB1' },
    { color: '#A5D6A7' },
    { color: '#90CAF9' },
    { color: '#FFCC80' },
    { color: '#CE93D8' },
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

  public setLoadingState(isLoading: boolean): void {
    this.isLoading = isLoading;
  }
  public selectNote(event: MouseEvent, color: string) {
    const clicked = event.currentTarget as HTMLElement;

    if (clicked.classList.contains('active')) {
      clicked.classList.remove('active');
      this.selectedColor = '';
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
    if (this.isLoading) {
      return;
    }

    this.setLoadingState(true);

    this.noteService
      .Postnote(title, description, this.selectedColor)
      .pipe(
        switchMap(() => this.noteService.Allnotes()),
        catchError((error) => {
          console.error('Erro capturado no componente:', error);

          setTimeout(() => {
            this.setLoadingState(false);
          }, 2000);
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.setLoadingState(false);
        this.close();
      });
  }

  public selectColor(color: string) {
    this.selectedColor = this.selectedColor === color ? '' : color;
  }
}

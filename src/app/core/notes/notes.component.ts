import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ModalComponent } from '../../features/modal/modal.component';

@Component({
  selector: 'app-notes',
  imports: [NgFor, NgIf, ModalComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent {
  notes = [
    {
      id: 1,
      title: 'Compras',
      content: 'Leite, ovos, pão, manteiga e café',
      color: '#FFF176',
      showFooter: false,
    },
    {
      id: 2,
      title: 'Reunião',
      content: 'Apresentar o relatório mensal na sexta às 14h',
      color: '#F48FB1',
      showFooter: false,
    },
    {
      id: 3,
      title: 'Ideias',
      content: 'Criar um app de receitas com filtro por ingredientes',
      color: '#A5D6A7',
      showFooter: false,
    },
    {
      id: 4,
      title: 'Leitura',
      content: 'Terminar o capítulo 7 do livro de Clean Code',
      color: '#90CAF9',
      showFooter: false,
    },
    {
      id: 5,
      title: 'Academia',
      content: 'Treino A: peito, ombro e tríceps às 18h',
      color: '#FFCC80',
      showFooter: false,
    },
    {
      id: 6,
      title: 'Aniversário',
      content: 'Lembrar de ligar para a Ana no dia 20',
      color: '#CE93D8',
      showFooter: false,
    },
  ];

  showModal = false;

  public showModalCreateNote() {
    document.insertBefore;
  }

  public createModal() {
    this.showModal = true;
  }

  public showEdit(note: any) {
    note.showFooter = true;
  }

  public hideEdit(note: any) {
    note.showFooter = false;
  }
}

import { Component, OnInit, Signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ModalComponent } from '../../features/modal/modal.component';
import { DeleteComponent } from '../../features/modal/delete/delete.component';
import { ServicesService } from '../services.service';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {ErrorComponent} from "../../features/error/error.component";
@Component({
  selector: 'app-notes',
  imports: [NgFor, NgIf, ModalComponent, DeleteComponent, ErrorComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent implements OnInit, OnDestroy {
  constructor(private services: ServicesService) {}

  notes: any[] = [];

  public pageAreLoaded: boolean = false;

  private sub!: Subscription;

  ngOnInit() {
    this.loadNotes();
    this.sub = this.services.notesUpdated$.subscribe(() => this.loadNotes());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async loadNotes() {
    this.notes = (await this.services.Allnotes()) ?? [];
    this.pageAreLoaded = true;
  }

  activeNoteId: number | null = null;

  showModal = false;

  showDeleteModal = false;

  public showModalCreateNote() {
    document.insertBefore;
  }

  selectedNote: any = null;

  public createModal(note: any = null) {
    this.selectedNote = note;
    this.showModal = true;
  }

  selectedNoteId: number | null = null;
  public createModalDelete(
    id: number,
    title: string,
    content: string,
    color: string,
  ) {
    this.selectedNoteId = id;
    this.showDeleteModal = true;
  }

  public showEdit(note: any) {
    this.activeNoteId = note.id;
  }

  public hideEdit(note: any) {
    this.activeNoteId = null;
  }
}

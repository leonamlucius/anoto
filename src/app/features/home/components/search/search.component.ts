import { Component, NgModule, ViewChild, ElementRef } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-search',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  constructor(
    protected searchService: SearchService,
    protected noteService: NoteService,
  ) {}

  public inputValue: string = '';

  @ViewChild('searchInput')
  private searchInput!: ElementRef<HTMLInputElement>;

  public clearSearch(): void {
    this.searchService.setActiveSearch(false);
    this.searchService.setValueSearch('');
    this.inputValue = '';
    this.noteService.setSearchFoundNotes(true);
  }
  public activeSearch(): void {
    if (this.searchService.getActiveSearch()) return;
    this.searchService.setActiveSearch(true);

    requestAnimationFrame(() => this.searchInput.nativeElement.focus());
  }

  public deactivateSearch(): void {
    if (this.inputValue) {
      return;
    }
    this.clearSearch();
    this.searchService.setActiveSearch(false);
  }

  public search(value: string) {
    if (!value) {
      this.searchService.setActiveSearch(false);
      this.noteService.setSearchFoundNotes(true);
      this.searchService.setValueSearch('');
      return;
    }
    if (!this.searchService.getActiveSearch()) {
      this.searchService.setActiveSearch(true);
    }
    this.searchService.setValueSearch(value);
  }
}

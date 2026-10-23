import { Component } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [AsyncPipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  constructor(protected searchService: SearchService) {}

  public search(value: string) {
    if (!value) {
      this.searchService.setValueSearch('');
      return;
    }
    this.searchService.setValueSearch(value);
  }
}

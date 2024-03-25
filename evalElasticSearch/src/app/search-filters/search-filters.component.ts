import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatChipListboxChange } from '@angular/material/chips';

import { SearchFilters } from '../services/models/search-filters.model';

@Component({
  selector: 'search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.less']
})
export class SearchFiltersComponent {
  @Input()
  public filters!: SearchFilters;

  @Input()
  public serviceLevel!: number;

  @Output()
  public filtersChange = new EventEmitter<SearchFilters>();

  public updateSearchFields(event: MatChipListboxChange): void {
    this.filters.searchFields = event.value;
    this.updateFilters();
  }

  public updateGenresFilter(event: MatChipListboxChange): void {
    this.filters.searchGenres = event.value;
    this.updateFilters();
  }

  public updateFilters(): void {
    this.filtersChange.emit(this.filters);
  }
}

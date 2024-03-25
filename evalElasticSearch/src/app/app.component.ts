import { Component } from '@angular/core';

import { SearchResult } from './services/models/search-result.model';
import { SearchFilters } from './services/models/search-filters.model';

import { BasicSearchService } from './services/basic-search.service';
import { IntermediateSearchService } from './services/intermediate-search.service';
import { AdvancedSearchService } from './services/advanced-search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public selectedService: number = 1;
  public searchQuery: string = "";

  public searchResults: SearchResult[] = [];
  public searchError: any = null;
  public isSearching: boolean = false;

  public searchFilters: SearchFilters = {
    matchExactly: false,
    excludeExplicit: false,

    searchFields: ["track_name", "album_name", "artists"],
    searchGenres: [],
    maxResults: 10,

    popularity: { min: 0, max: 100 },
    duration: { min: 0, max: 90 },
  };

  public constructor(
    private _basicSearchService: BasicSearchService,
    private _intermediateSearchService: IntermediateSearchService,
    private _advancedSearchService: AdvancedSearchService
  ) { }

  public search() {
    this.isSearching = true;
    this.searchResults = [];
    this.searchError = null;

    const request = this.chooseService().search(this.searchQuery, this.searchFilters);

    request.subscribe({
      next: searchResults => {
        this.searchResults = searchResults;
      },
      error: searchError => {
        this.searchError = searchError;
        this.isSearching = false;
      },
      complete: () => {
        this.isSearching = false;
      }
    });
  }

  private chooseService(): BasicSearchService | IntermediateSearchService | AdvancedSearchService {
    switch (this.selectedService) {
      case 1: return this._basicSearchService;
      case 2: return this._intermediateSearchService;
      case 3: return this._advancedSearchService;

      default:
        return this._basicSearchService;
    }
  }
}

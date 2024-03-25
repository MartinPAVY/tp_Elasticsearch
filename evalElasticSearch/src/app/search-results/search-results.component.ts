import { Component, Input } from '@angular/core';

import { SearchResult } from '../services/models/search-result.model';

@Component({
  selector: 'search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.less']
})
export class SearchResultsComponent {
  @Input()
  public results: SearchResult[] = [];

  public millisecondsToMinuteString(duration_ms: number): string {
    const seconds = duration_ms / 1000;
    const minutes = Math.floor(seconds / 60);

    const secondsOutsideMinutes = Math.floor(seconds % 60);
    const formattedSeconds = secondsOutsideMinutes < 10
      ? '0' + secondsOutsideMinutes
      : secondsOutsideMinutes;

    return `${minutes}:${formattedSeconds}`;
  }

  public genresToTitleCaseString(genres: string[]): string {
    return genres
      .map(genre => genre
        .replaceAll('-', ' ')
        .replace(/\w\S*/g, occurance => occurance.charAt(0).toUpperCase() + occurance.substring(1).toLowerCase())
      )
      .join(", ");
  }
}

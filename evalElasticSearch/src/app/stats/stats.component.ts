import { Component, OnInit } from '@angular/core';
import { StatsService } from '../services/stats.service';

@Component({
  selector: 'stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.less']
})
export class StatsComponent implements OnInit {
  public statistics = {
    averageSongLength: { result: 0, error: null },
    uniqueGenres: { result: 0, error: null },
    topFiveMostPublishedArtists: { result: Array<string>(), error: null }
  }

  public constructor(private _statsService: StatsService) { }

  public ngOnInit(): void {
    this._statsService.getAverageSongMsLength().subscribe({
      next: result => { this.statistics.averageSongLength.result = result; },
      error: searchError => { this.statistics.averageSongLength.error = searchError; }
    });

    this._statsService.countUniqueGenres().subscribe({
      next: result => { this.statistics.uniqueGenres.result = result; },
      error: searchError => { this.statistics.uniqueGenres.error = searchError; }
    });

    this._statsService.getTopFiveMostPublishedArtists().subscribe({
      next: result => { this.statistics.topFiveMostPublishedArtists.result = result; },
      error: searchError => { this.statistics.topFiveMostPublishedArtists.error = searchError; }
    });
  }

  public millisecondsToMinuteString(duration_ms: number): string {
    const seconds = duration_ms / 1000;
    const minutes = Math.floor(seconds / 60);

    const secondsOutsideMinutes = Math.floor(seconds % 60);
    const formattedSeconds = secondsOutsideMinutes < 10
      ? '0' + secondsOutsideMinutes
      : secondsOutsideMinutes;

    return `${minutes}:${formattedSeconds}`;
  }
}

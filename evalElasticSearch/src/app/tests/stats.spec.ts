import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { StatsService } from '../services/stats.service';

describe('StatsService', () => {
  let service: StatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [StatsService]
    });

    service = TestBed.inject(StatsService);
  });

  it('should get average song length', (done: DoneFn) => {
    service.getAverageSongMsLength().subscribe({
      next: result => {
        expect(result).toBeGreaterThan(229000);
        expect(result).toBeLessThan(230000);
        done();
      },
      error: error  => done.fail(error)
    });
  });

  it('should count the number of unique genres', (done: DoneFn) => {
    service.countUniqueGenres().subscribe({
      next: result => {
        expect(result).toBe(114);
        done();
      },
      error: error  => done.fail(error)
    });
  });

  it('should get the top five most published artists', (done: DoneFn) => {
    service.getTopFiveMostPublishedArtists().subscribe({
      next: result => {
        expect(result).toContain("George Jones");
        expect(result).toContain("Pritam");
        expect(result).toContain("Wolfgang Amadeus Mozart");
        expect(result).toContain("Arijit Singh");
        expect(result).toContain("Hank Williams");
        done();
      },
      error: error  => done.fail(error)
    });
  });
});

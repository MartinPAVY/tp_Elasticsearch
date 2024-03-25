import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { BasicSearchService, BasicSearchFilters } from '../services/basic-search.service';

describe('BasicSearchService', () => {
  let service: BasicSearchService;
  let defaultFilters: BasicSearchFilters;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [BasicSearchService]
    });

    service = TestBed.inject(BasicSearchService);

    defaultFilters = {
      matchExactly: false
    };
  });

  it('should search for track names without matching exactly', (done: DoneFn) => {
    const query: string = "Adele Simone";

    service.search(query, defaultFilters).subscribe({
      next: results => {
        expect(results.length).toBe(2);
        expect(results[0].track_name).toBe("Cumbia da Simone");
        expect(results[0].artists[0]).toBe("Manoel Cordeiro");

        done();
      },
      error: error  => done.fail(error)
    });
  });

  it('should search for track names with exact matches', (done: DoneFn) => {
    const query: string = "Shadow of the Day";
    defaultFilters.matchExactly = true;

    service.search(query, defaultFilters).subscribe({
      next: results => {
        expect(results.length).toBe(2);
        expect(results[0].track_name).toBe("Shadow of the Day");
        expect(results[0].artists[0]).toBe("Linkin Park");
        expect(results[0].album_name).toBe("Minutes to Midnight");

        done();
      },
      error: error  => done.fail(error)
    });
  });
});

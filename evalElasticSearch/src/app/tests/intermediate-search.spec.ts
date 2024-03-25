import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { IntermediateSearchService, IntermediateSearchFilters } from '../services/intermediate-search.service';

describe('IntermediateSearchService', () => {
  let service: IntermediateSearchService;
  let defaultFilters: IntermediateSearchFilters;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [IntermediateSearchService]
    });

    service = TestBed.inject(IntermediateSearchService);

    defaultFilters = {
      matchExactly: false,
      excludeExplicit: false,
      searchFields: ["track_name", "album_name", "artists"],
      maxResults: 10
    };
  });

  describe('Regression', () => {
    it('should search for track names without matching exactly', (done: DoneFn) => {
      const query: string = "Adele Simone";
      defaultFilters.searchFields = ["track_name"];

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
      defaultFilters.searchFields = ["track_name"];

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

  it('should search track_name, album_name, and artists fields', (done: DoneFn) => {
    const query: string = "Sleeping Wolf";

    service.search(query, defaultFilters).subscribe({
      next: results => {
        expect(results.length).toBe(10);

        expect(results[0].track_name).toBe("New Kings");
        expect(results[0].album_name).toBe("The Silent Ones");
        expect(results[0].artists[0]).toBe("Sleeping Wolf");

        expect(results[1].track_name).toBe("Who Are You");
        expect(results[1].album_name).toBe("Wolf");
        expect(results[1].artists[0]).toBe("The Delta Bombers");

        expect(results[2].track_name).toBe("Wolf");
        expect(results[2].album_name).toBe("Cool It Down");
        expect(results[2].artists[0]).toBe("Yeah Yeah Yeahs");

        done();
      },
      error: error  => done.fail(error)
    });
  });

  it('should change the number of search results', (done: DoneFn) => {
    const query: string = "Umbrella Starlight";
    defaultFilters.maxResults = 40;

    service.search(query, defaultFilters).subscribe({
      next: results => {
        expect(results.length).toBe(36);
        done();
      },
      error: error  => done.fail(error)
    });
  });

  it('should exclude explicit songs from results', (done: DoneFn) => {
    const query: string = "Flurry";
    defaultFilters.excludeExplicit = true;

    service.search(query, defaultFilters).subscribe({
      next: results => {
        expect(results.length).toBe(0);
        done();
      },
      error: error  => done.fail(error)
    });
  });
});

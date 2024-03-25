export interface SearchFilters {
  matchExactly: boolean;
  excludeExplicit: boolean;

  searchFields: string[];
  searchGenres: string[];
  maxResults: number;

  popularity: {
    min: number;
    max: number;
  };

  duration: {
    min: number;
    max: number;
  };
}

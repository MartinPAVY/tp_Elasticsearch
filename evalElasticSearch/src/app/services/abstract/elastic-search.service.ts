import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { ElasticRequest, ElasticRequestService } from './elastic-request.service';
import { SearchResult } from '../models/search-result.model';

type SearchResponse = { hits: { hits: SearchResult[] } };

export abstract class ElasticSearchService extends ElasticRequestService {
  protected formatSearchResults(response: SearchResponse): SearchResult[] {
    return response.hits.hits.map((hit: any) => hit._source);
  }

  protected runSearch(http: HttpClient, request: ElasticRequest): Observable<SearchResult[]> {
    return super.runRequest<SearchResponse>(http, request)
      .pipe(map(this.formatSearchResults));
  }
}

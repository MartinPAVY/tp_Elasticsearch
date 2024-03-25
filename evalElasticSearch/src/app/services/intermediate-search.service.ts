import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ElasticRequest } from './abstract/elastic-request.service';
import { ElasticSearchService } from './abstract/elastic-search.service';
import { SearchResult } from './models/search-result.model';
import { BasicSearchFilters } from './basic-search.service';

/**
 * @member excludeExplicit Indique qu'on souhaite exclure les morceaux contenant des paroles explicites
 * @member searchFields Une liste de champs de chaque chanson dans lesquels cherche les mots-clés
 * @member maxResults Le nombre maximal de résultats à retourner dans la réponse d'Elasticsearch
 *
 * Membres hérités
 * @member matchExactly Indique qu'on souhaite chercher une phrase exacte plutôt que des mots-clés
 */
export interface IntermediateSearchFilters extends BasicSearchFilters {
  excludeExplicit: boolean;
  searchFields: string[];
  maxResults: number;
}

@Injectable({ providedIn: 'root' })
export class IntermediateSearchService extends ElasticSearchService {

  constructor(private http: HttpClient) {
    super();
  }

  public search(query: string, filters: IntermediateSearchFilters): Observable<SearchResult[]> {
    const request: ElasticRequest = {
      elasticsearch: { url: "http://localhost:9200", endpoint: "_search" },
      method: "post" // Use POST method for search
    };

    const body = {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: query,
                fields: filters.searchFields,
                type: filters.matchExactly ? "phrase" : "cross_fields"
              }
            }
          ],
          must_not: filters.excludeExplicit ? { term: { explicit: true } } : undefined
        }
      },
      size: filters.maxResults
    };

    request.body = body;

    return this.runSearch(this.http, request);
  }
}

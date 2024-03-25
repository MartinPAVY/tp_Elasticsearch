import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ElasticRequest } from './abstract/elastic-request.service';
import { ElasticSearchService } from './abstract/elastic-search.service';
import { SearchResult } from './models/search-result.model';

/**
 * @member matchExactly Indique qu'on souhaite chercher une phrase exacte plutôt que des mots-clés
 */
export interface BasicSearchFilters {
  matchExactly: boolean;
}

@Injectable({ providedIn: 'root' })
export class BasicSearchService extends ElasticSearchService {

  constructor(private http: HttpClient) {
    super();
  }

  public search(query: string, filters: BasicSearchFilters): Observable<SearchResult[]> {
    const request: ElasticRequest = {
      elasticsearch: { url: "http://localhost:9200", endpoint: "_search" }, // Utilisez "_search" comme endpoint pour interroger Elasticsearch
      method: "post" // Utilisez la méthode HTTP "post" pour envoyer la requête
    };

    request.body = {
      query: {
        bool: {
          must: {
            match: {
              "track_name": {
                query: query,
                operator: filters.matchExactly ? "and" : "or" // Utilisez l'opérateur "and" pour une correspondance exacte, sinon "or" pour une correspondance partielle
              }
            }
          }
        }
      }
    };

    return this.runSearch(this.http, request);
  }
}

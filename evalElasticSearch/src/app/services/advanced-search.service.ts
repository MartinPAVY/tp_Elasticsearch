import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ElasticRequest } from './abstract/elastic-request.service';
import { ElasticSearchService } from './abstract/elastic-search.service';
import { SearchResult } from './models/search-result.model';
import { IntermediateSearchFilters } from './intermediate-search.service';

/**
 * @member searchGenres Filtre les moreaux selon une liste de genres fournie par l'utilisateur
 * @member popularity Filtre les morceaux selon un intervalle de popularité de 1 à 100
 * @member duration Filtre les morceaux selon leur durée en minutes de 0 à 90
 *
 * Membres hérités
 * @member excludeExplicit Indique qu'on souhaite exclure les morceaux contenant des paroles explicites
 * @member searchFields Une liste de champs de chaque chanson dans lesquels cherche les mots-clés
 * @member maxResults Le nombre maximal de résultats à retourner dans la réponse d'Elasticsearch
 * @member matchExactly Indique qu'on souhaite chercher une phrase exacte plutôt que des mots-clés
 */
export interface AdvancedSearchFilters extends IntermediateSearchFilters {
  searchGenres: string[];
  popularity: { min: number; max: number; };
  duration: { min: number; max: number; };
}

@Injectable({ providedIn: 'root' })
export class AdvancedSearchService extends ElasticSearchService {

  constructor(private http: HttpClient) {
    super();
  }
  public search(query: string, filters: AdvancedSearchFilters): Observable<SearchResult[]> {
    const request: ElasticRequest = {
      elasticsearch: { url: "http://localhost:9200", endpoint: "songs/_search" },
      method: "post"
    };

    let boolQuery: {
      must: Array<{ multi_match: { query: string; fields: string[]; type: string } }>,
      should: Array<{ match_phrase: { [key: string]: string } }>,
      must_not: Array<{ term: { explicit: boolean } }>,
      filter: Array<{ terms: { track_genre: string[] } } | { range: { popularity: { gte: number; lte: number } } } | { range: { duration_ms: { gte: number; lte: number } } }>
    } = {
      must: [],
      should: [],
      must_not: [],
      filter: []
    };

    if (filters.excludeExplicit) {
      boolQuery.must_not.push({ term: { explicit: true } });
    }

    if (filters.matchExactly) {
      filters.searchFields.forEach(field => {
        boolQuery.must.push({
          multi_match: {
            query: query,
            fields: [`${field}.keyword`],
            type: "phrase"
          }
        });
      });
    } else {
      boolQuery.must.push({
        multi_match: {
          query: query,
          fields: filters.searchFields,
          type: "cross_fields"
        }
      });
    }

    if (filters.searchGenres && filters.searchGenres.length > 0) {
      boolQuery.filter.push({ terms: { "track_genre": filters.searchGenres } });
    }

    if (filters.popularity) {
      boolQuery.filter.push({
        range: {
          "popularity": {
            gte: filters.popularity.min,
            lte: filters.popularity.max
          }
        }
      });
    }

    const durationMinMs = filters.duration.min * 60000;
    const durationMaxMs = filters.duration.max * 60000;
    if (filters.duration) {
      boolQuery.filter.push({
        range: {
          "duration_ms": {
            gte: durationMinMs,
            lte: durationMaxMs
          }
        }
      });
    }

    request.body = {
      query: {
        bool: boolQuery
      },
      size: filters.maxResults
    };

    return this.runSearch(this.http, request);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { ElasticRequest, ElasticRequestService } from './abstract/elastic-request.service';

type AverageSongMsLengthResponse = {
  aggregations: {
    averageSongMsLength: { value: number; };
  };
};

type UniqueGenresCountResponse = {
  aggregations: {
    uniqueGenresCount: { value: number; };
  };
};

type TopFivePublishedArtistsResponse = {
  aggregations: {
    topFivePublishedArtists: {
      buckets: { key: string, doc_count: number }[];
    };
  };
};

@Injectable({ providedIn: 'root' })
export class StatsService extends ElasticRequestService {

  constructor(private http: HttpClient) {
    super();
  }

  public getAverageSongMsLength(): Observable<number> {
    const request: ElasticRequest = {
      elasticsearch: { url: "http://localhost:9200", endpoint: "_search" },
      method: "post"
    };

    request.body = {
      "aggs": {
        "averageSongMsLength": {
          "avg": {
            "field": "duration_ms"
          }
        }
      }
    };

    return this.runRequest<AverageSongMsLengthResponse>(this.http, request)
      .pipe(map((response: AverageSongMsLengthResponse) => response.aggregations.averageSongMsLength.value));
  }

  public countUniqueGenres(): Observable<number> {
    const request: ElasticRequest = {
      elasticsearch: { url: "http://localhost:9200", endpoint: "_search" },
      method: "post"
    };

    request.body = {
      size: 0,
      "aggs": {
        "uniqueGenresCount": {
          "cardinality": {
            "field": "track_genre"
          }
        }
      }
    };

    return this.runRequest<UniqueGenresCountResponse>(this.http, request)
      .pipe(map((response: UniqueGenresCountResponse) => response.aggregations.uniqueGenresCount.value));
  }

  public getTopFiveMostPublishedArtists(): Observable<string[]> {
    const request: ElasticRequest = {
      elasticsearch: { url: "http://localhost:9200", endpoint: "_search" },
      method: "post"
    };

    request.body = {
      "aggs": {
        "topFivePublishedArtists": {
          "terms": {
            "field": "artists.keyword",
            "order": { "_count": "desc" },
            "size": 5
          }
        }
      }
    };

    return this.runRequest<TopFivePublishedArtistsResponse>(this.http, request)
      .pipe(map((response: TopFivePublishedArtistsResponse) => response.aggregations.topFivePublishedArtists.buckets.map(bucket => bucket.key)));
  }
}

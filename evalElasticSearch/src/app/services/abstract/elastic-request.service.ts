import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface ElasticRequest {
  elasticsearch: {
    url: string;
    endpoint: string;
  };

  method: "get" | "post" | "put" | "patch" | "delete" | "a-completer";
  body?: any;
}

export abstract class ElasticRequestService {
  protected formatUrl(request: ElasticRequest): string {
    return `${request.elasticsearch.url}/${request.elasticsearch.endpoint}`;
  }

  protected runRequest<TResult>(http: HttpClient, request: ElasticRequest): Observable<TResult> {
    if (request.method == "a-completer")
      return throwError(() => {
        return { error: { message: "Invalid HTTP method 'a-completer'" } };
      });

    return http[request.method](this.formatUrl(request), request.body) as Observable<TResult>;
  }
}

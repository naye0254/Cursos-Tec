import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {retry} from 'rxjs/operators';

import {SharedService} from '../../../shared/shared.service';
import {IAppConfig, APP_CONFIG} from '../../../../app.config';

/**
 * Support Tools services
 */
@Injectable()
export class SegmentsService extends SharedService {
  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    httpClient: HttpClient,
  ) {
    super(config, httpClient);
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }

  /**
   * Service to find all support tools that match all conditions
   */
  getAllSegments<T>(state: boolean = null): Observable<T> {
    const params = state == null ? `isActive='null'` : `isActive=${state}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Segments/get-all-segments?${params}`;
    return this.httpClient
      .get<T>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }
}

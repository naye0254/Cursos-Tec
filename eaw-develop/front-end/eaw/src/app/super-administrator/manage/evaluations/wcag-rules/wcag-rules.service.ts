import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {retry} from 'rxjs/operators';

import {SharedService} from '../../../../shared/shared.service';
import {IAppConfig, APP_CONFIG} from '../../../../../app.config';

/**
 * Criterions services
 */
@Injectable()
export class WcagRulesService extends SharedService {
  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    httpClient: HttpClient,
  ) {
    super(config, httpClient);
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }

  /**
   * Service to find all criterions that match all conditions
   */
  getAllCriterions<T>(state: boolean = null): Observable<T> {
    const params = state == null ? `isActive='null'` : `isActive=${state}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Criterions/get-all-criterions?${params}`;
    return this.httpClient
      .get<T>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Service to find all guide lines that match with a principle
   */
  getGuideByPrinciple<T>(principleId: number): Observable<T> {
    const params = `principleId=${principleId}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Criterions/get-guide-by-principle?${params}`;
    return this.httpClient
      .get<T>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }
}

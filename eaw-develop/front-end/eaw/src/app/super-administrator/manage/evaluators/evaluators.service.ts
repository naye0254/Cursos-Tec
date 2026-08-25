import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {SharedService} from '../../../shared/shared.service';
import {IAppConfig, APP_CONFIG} from '../../../../app.config';

/**
 * Evaluator services
 */
@Injectable()
export class EvaluatorsService extends SharedService {
  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    httpClient: HttpClient,
  ) {
    super(config, httpClient);
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }

  /**
   * Service to find all evaluators that match all conditions
   */
  getAllEvaluators<T>(state: boolean = null): Observable<T> {
    const params = state == null ? `isActive='null'` : `isActive=${state}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Users/evaluators?${params}`;
    return this.httpClient
      .get<T>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update a evaluator
   * @param modelName
   * @param modelData
   */
  public updateEvaluatorModel<T>(
    modelName: string,
    modelData: any,
  ): Observable<T> {
    const url = `${this.config.API_ENDPOINT_EAW}${modelName}`;
    const options = {headers: this.headers};
    return this.httpClient
      .post<T>(url, modelData, options)
      .pipe(catchError(this.handleError));
  }
}

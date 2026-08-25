import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SharedService} from '../../../../../shared/shared.service';
import {IAppConfig, APP_CONFIG} from '../../../../../../app.config';
import {Segments} from 'src/app/models/segments.model';

/**
 * Evaluations services
 */
@Injectable()
export class EvaluationErrorService extends SharedService {
  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    httpClient: HttpClient,
  ) {
    super(config, httpClient);
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }  

  /**
   * Get debug error by evaluation
   * @param evaluationId
   */
  public getErrorByEvaluation(evaluationId: number): Observable<any> {
    const url = `${this.config.API_ENDPOINT_EAW}ErrorDebugs/errorDebugsByEvaluationsId`;
    const params = new HttpParams().set(
      'evaluationsId',
      evaluationId.toString(),
    );
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<any>(url, options)
      .pipe(catchError(this.handleError));
  }

}
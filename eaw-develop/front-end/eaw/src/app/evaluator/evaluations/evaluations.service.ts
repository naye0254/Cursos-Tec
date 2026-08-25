import {APP_CONFIG, IAppConfig} from '../../../app.config';
import {catchError, retry} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable, Inject} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {Specifications} from '../../models/specifications';

/**
 * Class evaluations services in evaluator
 */
@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  protected headers: HttpHeaders;

  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig = null,
    protected httpClient: HttpClient = null,
  ) {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }

  /**
   * Service to find specifications by evaluation
   */
  getSpecificationsByEvaluation(
    evaluationId: number,
    evaluatorId: number = null,
  ): Observable<any> {
    const url = `${this.config.API_ENDPOINT_EAW}Specifications/evaluations-id`;
    const params = new HttpParams()
      .set('evaluationId', evaluationId.toString())
      .set('evaluatorId', JSON.stringify(evaluatorId));

    const options = {
      headers: this.headers,
      params,
    };
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Service to find specifications by evaluation
   */
  getPagesBySpecification(specificationId: number): Observable<any> {
    const url = `${this.config.API_ENDPOINT_EAW}Specifications/pages`;
    const params = new HttpParams().set(
      'specificationId',
      specificationId.toString(),
    );

    const options = {
      headers: this.headers,
      params,
    };
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Method to handle errors
   * @param error
   */
  public handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}

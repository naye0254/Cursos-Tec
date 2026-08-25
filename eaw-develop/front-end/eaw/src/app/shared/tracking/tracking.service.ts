import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {retry} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';

import {SharedService} from '../../shared/shared.service';
import {IAppConfig, APP_CONFIG} from '../../../app.config';

/**
 * Tracking evaluation services
 */
@Injectable()
export class TrackingService extends SharedService {
  private quantityEvalPromoterEvaluator: BehaviorSubject<any>;

  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    httpClient: HttpClient,
  ) {
    super(config, httpClient);
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.quantityEvalPromoterEvaluator = new BehaviorSubject<any>(null);
  }

  /**
   * Service to get the quantity of evaluations by promoter and state
   */
  getQuantityEvaluationByPromoter<T>(promoterId: number = null): Observable<T> {
    const params = `promoterId=${promoterId}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/get-quantity-evaluation-by-promoter?${params}`;
    return this.httpClient
      .get<T>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Service to get the quantity of evaluations by promoter and evaluator
   */
  getQuantityEvaluationByPromoterAndEvaluator<T>(
    promoterId: number = null,
    evaluatorId: number = null,
  ): Observable<T> {
    const params = `promoterId=${promoterId}&evaluatorId=${evaluatorId}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/get-quantity-evaluation-by-promoter-and-evaluator?${params}`;
    return this.httpClient
      .get<T>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Service to find all active evaluators
   */
  getAllEvaluators<T>(): Observable<T> {
    const params = `isActive='null'`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Users/evaluators?${params}`;
    return this.httpClient
      .get<T>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Service to find all active evaluators
   */
  getEvaluationsPagesState<T>(
    evaluationId: number,
    evaluatorId: number,
  ): Observable<T> {
    const params = `evaluationId=${evaluationId}&evaluatorId=${evaluatorId}&`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/get-all-sites-state-by-evaluation-evaluator?${params}`;
    return this.httpClient
      .get<T>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Service to get the quantity of evaluations by promoter and state
   */
  getEvaluationsByEvaluator<T>(
    manualEvaluationState: number,
    automaticEvaluationState: number,
    evaluatorId: number,
  ): Observable<T> {
    // tslint:disable-next-line: max-line-length
    const params = `manualEvaluationState=${manualEvaluationState}&automaticEvaluationState=${automaticEvaluationState}&evaluatorId=${evaluatorId}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/get-evaluations-by-evaluator?${params}`;
    return this.httpClient
      .get<T>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Set the information with the quantity in the BehaviorSubject
   * @param information
   */
  setQuantityEvalPromoterEvaluator(information: any): void {
    this.quantityEvalPromoterEvaluator.next(information);
  }

  /**
   * Return a BehaviorSubject to make a subscribe
   */
  getQuantityEvalPromoterEvaluator(): BehaviorSubject<any> {
    return this.quantityEvalPromoterEvaluator;
  }
}

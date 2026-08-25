import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {retry} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';

import {CommonConstants} from '../../../common/common.constants';
import {SharedService} from '../../../shared/shared.service';
import {IAppConfig, APP_CONFIG} from '../../../../app.config';

/**
 * New evaluation services
 */
@Injectable()
export class NewEvaluationService extends SharedService {
  private isHideStepTwo: BehaviorSubject<boolean>;

  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    httpClient: HttpClient,
  ) {
    super(config, httpClient);
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.isHideStepTwo = new BehaviorSubject<boolean>(false);
  }

  /**
   * Service to find all evaluator that match with a specific disability
   */
  getAllEvaluatorByDisability<T>(disabilityId: number = null): Observable<T> {
    const params = `disabilityId=${disabilityId}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}DisabilitiesByUsers/get-evaluators-by-disability?${params}`;
    return this.httpClient
      .get<T>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Service to find all segments that match with a specific client
   */
  getAllSegmentsByClients<T>(clientId: number = null): Observable<T> {
    const params = `clientId=${clientId}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}ClientsBySegments/get-segments-by-client?${params}`;
    return this.httpClient
      .get<T>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Service to find all evaluator that match with rol of direct client
   */
  getAllDirectClients<T>() {
    const url = `${this.config.API_ENDPOINT_EAW}Users`;
    const filter = {where: {roleTypesId: CommonConstants.roles.DirectClient, isDeleted: 0, isActive: 1}};
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<any>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Service to create the evaluation
   * @param evaluationsToCreate
   */
  postEvaluations<T>(evaluationsToCreate: any) {
    const httpData = {
      evaluationData: evaluationsToCreate,
    };
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/post-evaluation`;
    return this.httpClient
      .post<any>(url, httpData, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Set a state to the BehaviorSubject isHideStepTwo
   * @param mode
   */
  setHideStepTwo(mode: boolean): void {
    this.isHideStepTwo.next(mode);
  }

  /**
   * Return the BehaviorSubject isHideStepTwo
   */
  getHideStepTwo(): BehaviorSubject<boolean> {
    return this.isHideStepTwo;
  }

  /**
   * Service to find all sites names of evaluations created
   */
  getAllSitesNames<T>(): Observable<T> {
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/get-all-sites-names`;
    return this.httpClient
      .get<T>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }
}

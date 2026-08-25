import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {SharedService} from '../../shared/shared.service';
import {IAppConfig, APP_CONFIG} from '../../../app.config';
import {Segments} from 'src/app/models/segments.model';

/**
 * Evaluations services
 */
@Injectable()
export class EvaluationsService extends SharedService {
  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    httpClient: HttpClient,
  ) {
    super(config, httpClient);
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }

  /**
   * Get segments by country
   * @param countryId
   */
  public getSegmensByCountry(countryId: number): Observable<Segments[]> {
    const url = `${this.config.API_ENDPOINT_EAW}Segments`;
    const filter = {where: {countryId}};
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<Segments[]>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get a list of years of the evaluations
   */
  public getEvaluationsYears() {
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/years`;
    const options = {headers: this.headers};
    return this.httpClient
      .get<any>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get country by client
   * Assuemes that only exist a client by country
   * @param clientId
   */
  public getCountryByClient(clientId: number): Observable<any> {
    const url = `${this.config.API_ENDPOINT_EAW}ClientsByCountries/findOne`;
    const filter = {where: {clientsId: clientId}};
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<any>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get a list of indirect clients' name
   * @param clientId
   * @param year
   * @param segmentId
   */
  public getIndirectClientsByClient(
    clientId: number,
    year: string,
    segmentId: number,
  ) {
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/clients/id/indirect-client`;
    const params = new HttpParams()
      .set('clientId', clientId.toString())
      .set('year', year)
      .set('segmentId', segmentId.toString());
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<any>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   *  Get evaluations of indirect client
   * @param clientId
   * @param year
   * @param segmentId
   * @param indirectClient
   */
  public getEvaluationsByIndirectClient(
    clientId: number,
    year: string,
    segmentId: number,
    indirectClient: string,
  ) {
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/clients/id/year/segment/id/indirect-client`;
    const params = new HttpParams()
      .set('clientId', clientId.toString())
      .set('year', year)
      .set('segmentId', segmentId.toString())
      .set('indirectClient', indirectClient);
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<any>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get evaluation by id
   * @param evaluationId
   */
  public getEvaluationById(evaluationId: number): Observable<any> {
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/evaluation-id`;
    const params = new HttpParams().set(
      'evaluationId',
      evaluationId.toString(),
    );
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<any>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Service to send request for a evaluation
   * @param clientId
   * @param message
   */
  public sendRequestEvaluation(
    clientId: number,
    message: string,
  ): Observable<any> {
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/requestEvaluationToOtai`;
    const params = new HttpParams()
      .set('clientId', clientId.toString())
      .set('message', message);
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<any>(url, options)
      .pipe(catchError(this.handleError));
  }
}

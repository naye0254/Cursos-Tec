import {Injectable, Inject} from '@angular/core';

import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

import {SharedService} from '../../../../../shared/shared.service';

import {IAppConfig, APP_CONFIG} from '../../../../../../app.config';

@Injectable()
/**
 * Service to finding component
 */
class FindingsService extends SharedService {
  constructor(@Inject(APP_CONFIG) public config: IAppConfig, public httpClient: HttpClient) {
    super(config, httpClient);
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }

  /**
   * Get pages by evaluation Id
   * @param evaluationId
   */
  public getAutomaticEvaluatorPagesByEvaluationId(evaluationId: number) {
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/pages`;
    const params = new HttpParams().set('evaluationId', evaluationId.toString());
    const options = {headers: this.headers, params};
    return this.httpClient.get<any>(url, options).pipe(catchError(this.handleError));
  }

  /**
   * Get disabilities assigned to an evaluation
   * @param evaluationId
   */
  public getDisabilityByEvaluationId(evaluationId: number) {
    const url = `${this.config.API_ENDPOINT_EAW}Specifications/evaluation-id/disabilities`;
    const params = new HttpParams().set('evaluationId', evaluationId.toString());
    const options = {headers: this.headers, params};
    return this.httpClient.get<any>(url, options).pipe(catchError(this.handleError));
  }

  /**
   *  Get answers by manual pages
   * @param evaluationId
   * @param disabiliyRolId
   * @param principleId
   * @param pageList
   */
  public getAnwersByManualPage(
    evaluationId: number,
    disabiliyRolId: any,
    principleId: any,
    pageList: any
  ) {
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/getAnwersByManualPage`;
    const body = {
      evaluationId,
      disabiliyRolId,
      principleId,
      pageList
    };

    const options = {headers: this.headers};
    return this.httpClient.post<any>(url, body, options).pipe(catchError(this.handleError));
  }

  /**
   *  Get observations by manual pages
   * @param evaluationId
   * @param disabiliyRolId
   * @param principleId
   * @param pageList
   */
  public getObservationsByManualPage(
    evaluationId: number,
    disabiliyRolId: any,
    principleId: any,
    pageList: any
  ) {
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/getObservationsByManualPage`;
    const body = {
      evaluationId,
      disabiliyRolId,
      principleId,
      pageList
    };

    const options = {headers: this.headers};
    return this.httpClient.post<any>(url, body, options).pipe(catchError(this.handleError));
  }

  /**
   *  Get principle by Id
   * @param principleId
   */
  public getPrincipleById(principleId: number) {
    const url = `${this.config.API_ENDPOINT_EAW}Principles/${principleId}`;

    const options = {headers: this.headers};
    return this.httpClient.get<any>(url, options).pipe(catchError(this.handleError));
  }

  /**
   * Service to find all guide lines that match with a principle
   */
  getGuideByPrinciple<T>(principleId: number): Observable<T> {
    const params = `principleId=${principleId}`;
    const options = {
      headers: this.headers
    };
    const url = `${this.config.API_ENDPOINT_EAW}Criterions/get-guide-by-principle?${params}`;
    return this.httpClient.get<T>(url, options).pipe(catchError(this.handleError));
  }

  /**
   * Get criterions by guideline
   * @param guideline
   */
  getCriterionsByGuideline(guidelinesId: number): Observable<any[]> {
    const url = `${this.config.API_ENDPOINT_EAW}Criterions`;
    const filter = {where: {guidelinesId}};
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    const options = {headers: this.headers, params};
    return this.httpClient.get<any[]>(url, options).pipe(catchError(this.handleError));
  }

  /**
   *  Get findings by automatic page
   * @param evaluationId
   * @param disabiliyRolId
   * @param principleId
   * @param pageList
   */
  public getFindingsByAutomaticPage(
    evaluationId: number,
    guidelines: any,
    criterion: any,
    pageList: any,
    limit: number,
    skip: number
  ) {
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/getFindingsByAutomaticPage`;
    const body = {
      evaluationId,
      guidelines,
      criterion,
      pageList,
      limit,
      skip
    };

    const options = {headers: this.headers};
    return this.httpClient.post<any>(url, body, options).pipe(catchError(this.handleError));
  }
}
export {FindingsService};

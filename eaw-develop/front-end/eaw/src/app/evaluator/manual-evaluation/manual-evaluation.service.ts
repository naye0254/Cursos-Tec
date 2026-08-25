import {Injectable, Inject} from '@angular/core';
import {IAppConfig, APP_CONFIG} from '../../../app.config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SharedService} from '../../shared/shared.service';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {retry} from 'rxjs/operators';

@Injectable()
class ManualEvaluationService extends SharedService {
  /**
   * Constructor ManualEvaluation service
   * @param config
   * @param httpClient
   */
  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    httpClient: HttpClient,
  ) {
    super(config, httpClient);
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }

  /**
   * Gets the spectifications and page information.
   * @param token
   * @param specificationId
   * @param idPage
   */
  public getSpectsAndPageInfo<T>(
    token: string,
    specificationId: number,
    idPage: number,
  ): Observable<any> {
    const params = `specificationId=${specificationId}&idPage=${idPage}&access_token=${token}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Specifications/specificationAndPageInfo?${params}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Get principle
   * @param token
   * @param id
   */
  public getPrinciple<T>(token: string, id: number): Observable<any> {
    const params = `${id}?access_token=${token}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Principles/${params}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Get the criterion form.
   */
  public getCriterionsForm<T>(
    token: string,
    idEvaluation: number,
    idSpecification: number,
    idPrinciple: number,
  ): Observable<any> {
    const params = `evaluationsId=${idEvaluation}&specificationsId=${idSpecification}&principleId=${idPrinciple}&access_token=${token}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}CriterionsByDisabilityRoles/formCriterionsByDisability?${params}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Get the saved manual answers.
   * @param token
   * @param idManualPage
   */
  public getSavedManualAnswers<T>(
    token: string,
    idManualPage: any,
  ): Observable<any> {
    const params = `/${idManualPage}?&access_token=${token}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}ManualPages${params}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Save the new answers.
   * @param formObject
   * @param isFinished
   * @param idManualPage
   * @param token
   */
  public saveManualAnswers<T>(
    formObject: any,
    isFinished: boolean,
    idManualPage: any,
    token: string,
  ): Observable<any> {
    const modelData = {
      idManualPage,
      isFinished,
      formObject,
    };
    const url = `${this.config.API_ENDPOINT_EAW}ManualAnswers/saveManualAnswers?access_token=${token}`;
    const options = {headers: this.headers};
    return this.httpClient
      .post<any>(url, modelData, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Save the personal recommendation or comment of the evaluator by principle.
   * @param principleId
   * @param idManualPage
   * @param observation
   * @param token
   */
  public savePersonalRecommendation<T>(
    principleId: any,
    idManualPage: any,
    observation: any,
    token: string,
  ): Observable<any> {
    const modelData = {
      principleId,
      idManualPage,
      observation,
    };
    const url = `${this.config.API_ENDPOINT_EAW}ManualPages/saveObservationField?access_token=${token}`;
    const options = {headers: this.headers};
    return this.httpClient
      .post<any>(url, modelData, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Get the personal recommendation or comment of the evaluator by principle.
   * @param principleId
   * @param idManualPage
   * @param token
   */
  public getPersonalRecommendation<T>(
    principleId: any,
    idManualPage: any,
    token: string,
  ): Observable<any> {
    const modelData = {
      principleId,
      idManualPage,
    };
    const url = `${this.config.API_ENDPOINT_EAW}ManualPages/getObservationField?access_token=${token}`;
    const options = {headers: this.headers};
    return this.httpClient
      .post<any>(url, modelData, options)
      .pipe(retry(1), catchError(this.handleError));
  }
}
export {ManualEvaluationService};

import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {SharedService} from '../../../../../shared/shared.service';
import {IAppConfig, APP_CONFIG} from '../../../../../../app.config';

@Injectable()
class StatisticsService extends SharedService {
  // tslint:disable-next-line: variable-name
  private __StatisticsServiceDataSubject: Subject<any>;

  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    public httpClient: HttpClient,
  ) {
    super(config, httpClient);
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.__StatisticsServiceDataSubject = new Subject<any>();
  }

  public set statisticsServiceDataSubject(value: any) {
    this.__StatisticsServiceDataSubject.next(value);
  }

  public get statisticsServiceDataSubject(): any {
    return this.__StatisticsServiceDataSubject;
  }

  /**
   * Get statistics by guideline automatic
   * @param evaluationId
   * @param conformityLevel
   * @param guidelines
   * @param pageList
   */
  getStatisticsByGuideLineAutomatic(
    evaluationId: number,
    conformityLevel: string,
    guidelines: any,
    pageList: any,
  ) {
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/getStatisticsByGuideLineAutomatic`;
    const body = {
      evaluationId,
      conformityLevel,
      guidelines,
      pageList,
    };
    const options = {headers: this.headers};
    return this.httpClient
      .post<any>(url, body, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get statistics by guideline manual
   * @param evaluationId
   * @param conformityLevel
   * @param guidelines
   * @param pageList
   */
  getStatisticsByGuideLineManual(
    evaluationId: number,
    specificationId: number,
    conformityLevel: string,
    guidelines: any,
    pageList: any,
  ) {
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/getStatisticsByGuideLineManual`;
    const body = {
      evaluationId,
      specificationId,
      conformityLevel,
      guidelines,
      pageList,
    };
    const options = {headers: this.headers};
    return this.httpClient
      .post<any>(url, body, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get pages by evaluation
   * @param evaluationId
   */
  getPagesByEvaluation(evaluationId) {
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/pages`;
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
   * Get specifications by evaluation
   */
  getSpecificationsByEvaluation(evaluationId) {
    const url = `${this.config.API_ENDPOINT_EAW}Specifications`;
    const filter = {
      where: {evaluationsId: evaluationId},
      include: [
        {
          relation: 'specificationsBrowsers',
        },
        {
          relation: 'specificationsDevices',
        },
        {
          relation: 'specificationsOperativeSystems',
        },
        {
          relation: 'specificationsSupportTools',
        },
        {
          relation: 'specificationsDisabilities',
        },
      ],
    };
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<any>(url, options)
      .pipe(catchError(this.handleError));
  }
}
export {StatisticsService};

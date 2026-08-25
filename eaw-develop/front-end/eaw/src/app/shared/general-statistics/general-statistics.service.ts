import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Subject, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {IAppConfig, APP_CONFIG} from '../../../app.config';
import {CommonConstants} from '../../common/common.constants';

@Injectable({
  providedIn: 'root'
})
export class GeneralStatisticsService {
  private __GeneralStatisticsServiceDataSubject: Subject<any>;
  public headers: HttpHeaders;
  constructor(@Inject(APP_CONFIG) public config: IAppConfig, public httpClient: HttpClient) {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.__GeneralStatisticsServiceDataSubject = new Subject<any>();
  }
  public set GeneralStatisticsServiceDataSubject(value: any) {
    this.__GeneralStatisticsServiceDataSubject.next(value);
  }

  public get GeneralStatisticsServiceDataSubject(): any {
    return this.__GeneralStatisticsServiceDataSubject;
  }

  /**
   * Service to find all users that match with rol of direct client
   */
  getAllDirectClients<T>() {
    const url = `${this.config.API_ENDPOINT_EAW}Users`;
    const filter = {
      where: {
        roleTypesId: CommonConstants.roles.DirectClient,
        isDeleted: 0,
        isActive: 1
      },
      order: 'firstName'
    };
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    const options = {headers: this.headers, params};
    return this.httpClient.get<any>(url, options).pipe(catchError(this.handleError));
  }

  /**
   * Service to find all active segments ordered alphabetically
   */
  getAllSegments<T>() {
    const url = `${this.config.API_ENDPOINT_EAW}Segments`;
    const filter = {where: {isActive: 1}, order: 'name'};
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    const options = {headers: this.headers, params};
    return this.httpClient.get<any>(url, options).pipe(catchError(this.handleError));
  }

  /**
   * Get the general statistics from the backend based on the filters that the user selected
   * @param clients
   * @param segments
   * @param DateInitial
   * @param DateFinal
   * @returns
   */
  getGeneralStatistics(clients: any[], segments: any[], DateInitial: any, DateFinal: any) {
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/getGeneralStatisticsBySegmentAndYear`;
    const body = {
      clients,
      segments,
      DateInitial,
      DateFinal
    };
    const options = {headers: this.headers};
    return this.httpClient.post<any>(url, body, options).pipe(catchError(this.handleError));
  }

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

import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {retry} from 'rxjs/operators';

import {SharedService} from '../../shared/shared.service';
import {IAppConfig, APP_CONFIG} from '../../../app.config';
import {Segments} from '../../models/segments.model';

/**
 * Client services
 */
@Injectable()
export class ClientsService extends SharedService {
  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    httpClient: HttpClient,
  ) {
    super(config, httpClient);
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }

  /**
   * Service to find clients that match all conditions
   * @param name
   * @param email
   * @param createdBy
   * @param createdAt
   */
  advanceSearchClients(
    name: string = null,
    email: string = null,
    createdBy: any = null,
    createdAt: any = null,
    segmentId: any = null,
    isActive: any = null,
    isDeleted : any = null
  ): Observable<any> {
    const params = {
      name,
      email,
      createdBy,
      createdAt,
      segmentId,
      isActive,
      isDeleted
    };
    const options = {
      headers: this.headers,
      params,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Clients/clientsWithEvaluations`;
    return this.httpClient
      .post<any>(url, null, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  getSegmentById(segmentId: number) {
    const url = `${this.config.API_ENDPOINT_EAW}Segments/findOne`;
    const filter = {where: {id: segmentId}};
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<Segments>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get segments by country
   * @param countryId
   */
  getSegmensByCountry(countryId: number): Observable<Segments[]> {
    const url = `${this.config.API_ENDPOINT_EAW}Segments`;
    const filter = countryId !== 0 ? {where: {countryId}} : null;
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<Segments[]>(url, options)
      .pipe(catchError(this.handleError));
  }
}

import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {SharedService} from '../../shared/shared.service';
import {IAppConfig, APP_CONFIG} from '../../../app.config';
import {Segments} from 'src/app/models/segments.model';

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
   * Get segments by country
   * @param countryId
   */
  getSegmensByCountry(countryId: number): Observable<Segments[]> {
    const url = `${this.config.API_ENDPOINT_EAW}Segments`;
    const filter = {where: {countryId}};
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<Segments[]>(url, options)
      .pipe(catchError(this.handleError));
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

  getAllSegmens(): Observable<any[]> {
    const url = `${this.config.API_ENDPOINT_EAW}Segments`;
    const filter = {include: [{relation: 'segmentsCountries'}]};
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<Segments[]>(url, options)
      .pipe(catchError(this.handleError));
  }
}

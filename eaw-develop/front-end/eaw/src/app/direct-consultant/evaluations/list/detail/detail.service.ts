import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {SharedService} from '../../../../shared/shared.service';
import {IAppConfig, APP_CONFIG} from '../../../../../app.config';

@Injectable()
class DetailService extends SharedService {
  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    public httpClient: HttpClient,
  ) {
    super(config, httpClient);
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }

  /**
   * Send an email to indirect client
   * @param evaluationId
   */
  notifyIndirectClient(evaluationId, email) {
    const url = `${this.config.API_ENDPOINT_EAW}Clients/notifyIndirectClient`;
    const params = new HttpParams()
      .set('evaluationId', evaluationId.toString())
      .set('email', email.toString());
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<any>(url, options)
      .pipe(catchError(this.handleError));
  }
}
export {DetailService};

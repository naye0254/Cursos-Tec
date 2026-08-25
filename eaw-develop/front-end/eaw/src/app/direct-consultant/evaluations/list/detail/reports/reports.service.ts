import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {SharedService} from '../../../../../shared/shared.service';
import {IAppConfig, APP_CONFIG} from '../../../../../../app.config';

@Injectable()
class ReportsService extends SharedService {
  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    public httpClient: HttpClient,
  ) {
    super(config, httpClient);
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }

  downloadReport(documentName: string) {
    const url = `${this.config.API_ENDPOINT_EAW}containers/reports/download/${documentName}`;
    return url;
  }
}
export {ReportsService};

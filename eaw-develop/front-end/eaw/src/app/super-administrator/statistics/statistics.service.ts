import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {retry} from 'rxjs/operators';

import {SharedService} from '../../shared/shared.service';
import {IAppConfig, APP_CONFIG} from '../../../app.config';

@Injectable()
export class StatisticsService {
  protected headers: HttpHeaders;

  constructor(@Inject(APP_CONFIG) public config: IAppConfig, httpClient: HttpClient) {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }
}

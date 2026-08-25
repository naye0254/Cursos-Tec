import {Injectable, Inject} from '@angular/core';
import {IAppConfig, APP_CONFIG} from '../../../app.config';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {SharedService} from '../../shared/shared.service';
import {catchError} from 'rxjs/operators';

@Injectable()
class AddManuallyPageService extends SharedService {
  /**
   * Constructor AddManuallyPage service
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
   * Add page to manual evaluation manually.
   * @param idEvaluation
   * @param pUrl
   * @param title
   */
  addPageToManualEvaluation(idEvaluation: any, pUrl: string, title: string) {
    const url = `${this.config.API_ENDPOINT_EAW}Pages/addPageToManualEvaluation`;
    const params = new HttpParams()
      .set('idEvaluation', idEvaluation)
      .set('url', pUrl)
      .set('title', title);
    const options = {
      headers: this.headers,
      params,
    };
    return this.httpClient
      .get<any>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Start the develop manual evaluation, only changing the states of the evaluations to start
   * to avoid problems of duplicity with the normal start.
   * @param idEvaluation
   */
  startDevelopManualEvaluation(idEvaluation: any) {
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/startDevelopManualEvaluation`;
    const params = new HttpParams().set('idEvaluation', idEvaluation);
    const options = {
      headers: this.headers,
      params,
    };
    return this.httpClient
      .get<any>(url, options)
      .pipe(catchError(this.handleError));
  }
}
export {AddManuallyPageService};

import {Injectable, Inject} from '@angular/core';
import {IAppConfig, APP_CONFIG} from '../../../../../app.config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SharedService} from '../../../../shared/shared.service';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {retry} from 'rxjs/operators';

@Injectable()
class DetailEvaluationService extends SharedService {
  /**
   * Constructor DetailEvaluation service
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
   * Get the parsed data of the sitemap.
   * @param token
   * @param id
   */
  public getParsedSiteMap<T>(token: string, id: number): Observable<any> {
    const params = `idEvaluation=${id}&access_token=${token}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/get-parsedSiteMap?${params}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Get the siteMap.
   * @param token
   * @param id
   */
  public getSiteMap<T>(token: string, id: number): Observable<any> {
    const params = `idEvaluation=${id}&access_token=${token}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/get-MapSite?${params}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Save the selected pages.
   * @param token
   * @param idEvaluation
   * @param selectedPages
   * @param selectedSiteMap
   */
  public saveSelectedPages(
    token: any,
    idEvaluation: number,
    selectedPages: any,
    selectedSiteMap: any,
  ): Observable<any> {
    const object = {
      evaluatorId: idEvaluation,
      selectedPages,
      selectedSiteMap,
    };
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Pages/saveSelectedPages?access_token=${token}`;
    return this.httpClient
      .post<any>(url, object, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * For get the selected site map.
   * @param token
   * @param id
   */
  public getSelectedSiteMap<T>(token: string, id: number): Observable<any> {
    const params = `idEvaluation=${id}&access_token=${token}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/getSelectedMapSite?${params}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Get the path of the zip of the Site Map for download.
   * @param token
   * @param id
   */
  public getPathZipTree<T>(token: string, id: number): Observable<any> {
    const params = `idEvaluation=${id}&access_token=${token}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/files-tree?${params}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  public getCompletePathToDownload(containerPath) {
    return `${this.config.API_ENDPOINT_EAW}${containerPath}`;
  }
}
export {DetailEvaluationService};

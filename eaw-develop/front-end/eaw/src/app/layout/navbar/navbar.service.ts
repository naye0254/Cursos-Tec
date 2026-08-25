import {Injectable, Inject} from '@angular/core';
import {IAppConfig, APP_CONFIG} from '../../../app.config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SharedService} from '../../shared/shared.service';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {retry} from 'rxjs/operators';

@Injectable()
class NavbarService extends SharedService {
  /**
   * Constructor login service
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
   * Get the Iana attribute from an language.
   * @param token
   * @param idLang
   */
  public getIana<T>(token: string, idLang: number): Observable<any> {
    const params = idLang;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Languages/${params}?access_token=${token}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Change in the table Users the attribute language of the user.
   * @param userId
   * @param iana
   * @param token
   */
  public changeLanguageForUser<T>(
    userId: any,
    iana: any,
    token: string,
  ): Observable<T> {
    const modelData = {
      userId,
      iana,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Users/updateUserLanguajePreference?access_token=${token}`;
    const options = {headers: this.headers};
    return this.httpClient
      .post<any>(url, modelData, options)
      .pipe(catchError(this.handleError));
  }
}
export {NavbarService};

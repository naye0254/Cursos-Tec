import {Injectable, Inject} from '@angular/core';
import {LoginModel} from '../../models/user.model';
import {IAppConfig, APP_CONFIG} from '../../../app.config';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {SharedService} from '../../shared/shared.service';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {retry} from 'rxjs/operators';

@Injectable()
class LoginService extends SharedService {
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

  /** TODO: LOGIN BY CODE */
  loginByCode(mainurl: string, code: string) {}

  /**
   * Login for direct clients, enter by email and password.
   * @param email
   * @param password
   */
  loginByUser(email: string, password: string): Observable<LoginModel> {
    const credentials = {
      email,
      password,
    };
    const loginModel = credentials as LoginModel;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Users/login?include=user`;
    return this.httpClient.post<LoginModel>(url, loginModel, options);
  }

  /**
   * Login and redict a indirect client
   * @param pUrl
   * @param code
   */
  loginByUrl(pUrl: string, code: string) {
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/verify-credentials`;
    const params = new HttpParams().set('url', pUrl).set('code', code);

    const options = {
      headers: this.headers,
      params,
    };
    return this.httpClient
      .get<any>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get the name of the role by id.
   * @param token
   * @param id
   */
  public getRoleName<T>(token: string, id: number): Observable<any> {
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}RoleTypes/${id}?access_token=${token}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }
}
export {LoginService};

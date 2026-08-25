import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {IAppConfig, APP_CONFIG} from '../../../app.config';
import {Observable} from 'rxjs';
import {SharedService} from '../../shared/shared.service';
import {ContactEmail} from '../../models/user.model';
import {catchError} from 'rxjs/operators';
import {retry} from 'rxjs/operators';

@Injectable()
class ContactService extends SharedService {
  /**
   * Constructor contact service
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
   * Sends an email for contact with OTAI.
   * @param name
   * @param company
   * @param telephone
   * @param email
   * @param message
   */
  sendEmail(
    name: string,
    company: string,
    telephone: string,
    email: string,
    message?: string,
  ): Observable<ContactEmail> {
    const credentials = {
      name,
      company,
      telephone,
      email,
      message,
    };
    const emailModel = credentials as ContactEmail;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Users/sendMessageContact`;
    return this.httpClient
      .post<ContactEmail>(url, emailModel, options)
      .pipe(retry(1), catchError(this.handleError));
  }
}
export {ContactService};

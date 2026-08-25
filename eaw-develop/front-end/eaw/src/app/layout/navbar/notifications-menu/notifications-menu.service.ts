import {Injectable, Inject} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {IAppConfig, APP_CONFIG} from '../../../../app.config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SharedService} from '../../../shared/shared.service';
import {retry} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable()
class NotificationsMenuService extends SharedService {
  public user: any;
  /**
   * Constructor notification-menu service
   * @param config
   * @param httpClient
   */
  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    httpClient: HttpClient,
  ) {
    super(config, httpClient);
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.user = this.getUserInfoFromLocalStorage();
  }

  /**
   * Logout of an user, remove AccessToken.
   */
  logout(): Observable<any> {
    const token = this.user.userToken;
    const options = {
      headers: this.headers,
    };
    const url =
      `${this.config.API_ENDPOINT_EAW}Users/logout?access_token=` + token;
    return this.httpClient
      .post<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Service to get the last unseen notifications.
   * @param quantity
   */
  public getNotifications<T>(quantity: number): Observable<any> {
    const token = this.user.userToken;
    const params = `userId=${this.user.id}&quantity=${quantity}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Notifications/lastUnSeenNotifications?${params}&access_token=${token}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Service to get the last notifications.
   * @param quantity
   */
  public getAllNotifications<T>(quantity: number): Observable<any> {
    const token = this.user.userToken;

    const params = `userId=${this.user.id}&quantity=${quantity}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Notifications/lastNotifications?${params}&access_token=${token}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Service the mark as seen a notification.
   * @param notificationId
   */
  public setNotificationAsSeen<T>(notificationId: number): Observable<any> {
    const token = this.user.userToken;
    const params = `id=${notificationId}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Notifications/markNotificationAsSeen?${params}&access_token=${token}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }
}
export {NotificationsMenuService};

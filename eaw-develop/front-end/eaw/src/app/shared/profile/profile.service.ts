import {APP_CONFIG, IAppConfig} from '../../../app.config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {retry} from 'rxjs/operators';

import {SharedService} from '../shared.service';
import {FormGroup} from '@angular/forms';

/**
 * Profile services
 */
@Injectable({
  providedIn: 'root',
})
export class ProfileService extends SharedService {
  /**
   * Constructor profile service
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
   * Get all the languages.
   * @param token
   */
  public getLangs<T>(token: string): Observable<any> {
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Languages?access_token=${token}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
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
   * Change in the table Users the language attribute.
   * @param modelData
   * @param token
   */
  public changeLanguageForUser<T>(
    modelData: any,
    token: string,
  ): Observable<T> {
    const url = `${this.config.API_ENDPOINT_EAW}Users/updateUserLanguajePreference?access_token=${token}`;
    const options = {headers: this.headers};
    return this.httpClient
      .post<any>(url, modelData, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update the data in the table Users.
   * @param token
   * @param idUser
   * @param modelData
   */
  public updateUserData<T>(
    token: string,
    idUser: number,
    modelData: any,
  ): Observable<T> {
    const url = `${this.config.API_ENDPOINT_EAW}Users/${idUser}?access_token=${token}`;
    const options = {headers: this.headers};
    return this.httpClient
      .patch<T>(url, modelData, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get all notifications.
   * @param token
   * @param userId
   */
  public getAllNotifications<T>(
    token: string,
    userId: number,
  ): Observable<any> {
    const params = `userId=${userId}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Notifications/lastNotifications?${params}&access_token=${token}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Mark a notification as seen.
   * @param token
   * @param notificationId
   */
  public setNotificationAsSeen<T>(
    token: string,
    notificationId: number,
  ): Observable<any> {
    const params = `id=${notificationId}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Notifications/markNotificationAsSeen?${params}&access_token=${token}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Change the password of the user.
   * @param oldPassword
   * @param newPassword
   * @param token
   */
  public changePassword<T>(
    oldPassword: string,
    newPassword: string,
    token: string,
  ): Observable<T> {
    const modelData = {
      oldPassword,
      newPassword,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Users/change-password?access_token=${token}`;
    const options = {headers: this.headers};
    return this.httpClient
      .post<any>(url, modelData, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Check if two inputs are the same. In this case for password.
   */
  checkIfMatchingPasswords(
    passwordKey: string,
    passwordConfirmationKey: string,
  ) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey];
      const passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({
          notEquivalent: true,
        });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }
}

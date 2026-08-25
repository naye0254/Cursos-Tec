import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {retry} from 'rxjs/operators';
import {FormGroup} from '@angular/forms';

import {VerifyEmail, ChangePassword} from '../../models/user.model';
import {SharedService} from '../../shared/shared.service';
import {IAppConfig, APP_CONFIG} from '../../../app.config';

@Injectable()
class UserRestoreService extends SharedService {
  /**
   * Constructor user-restore service
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

  /**
   * Sends an email for change the password when user forgets password.
   * @param email
   */
  sendChangePasswordEmail(email: string): Observable<VerifyEmail> {
    const credentials = {
      email,
    };
    const emailModel = credentials as VerifyEmail;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Users/reset`;
    return this.httpClient
      .post<VerifyEmail>(url, emailModel, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Change the password of an user, with the accessToken temporal (15 min) getted in the email.
   * @param accessToken
   * @param newPassword
   */
  changeNewPassword(
    accessToken: any,
    newPassword: any,
  ): Observable<ChangePassword> {
    const credentials = {
      newPassword,
    };
    const changePasswordModel = credentials as ChangePassword;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Users/reset-password?access_token=${accessToken}`;
    return this.httpClient
      .post<ChangePassword>(url, changePasswordModel, options)
      .pipe(retry(1), catchError(this.handleError));
  }
}
export {UserRestoreService};

import {APP_CONFIG, IAppConfig} from '../../app.config';
import {catchError, retry} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable, Inject} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {throwError} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {CommonConstants} from '../common/common.constants';
import * as moment from 'moment';

import * as crypto from 'crypto-js';
import {User} from '../models/user.model';

/**
 * Class for shared services of the project
 */
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  protected headers: HttpHeaders;

  public isNotificationChange: boolean;

  public notificationChange: Subject<boolean> = new Subject<boolean>();

  public evaluationState: number = 0;

  private paginationState = {
      previousPageIndex: 0,
      pageIndex: 1,
      pageSize: 5,
      length: 0,
      itemsPerPage: 0,
      beginRange: 0,
      endRange: 0
  }

  private paginator = undefined;

  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig = null,
    protected httpClient: HttpClient = null,
    private titleService: Title = null,
  ) {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.notificationChange.subscribe(value => {
      this.isNotificationChange = value;
    });
  }
  public getIndirectCLientInfo() {
    const userExist = this.getItemFromLocalStorage(
      CommonConstants.KEY_INDIRECT_CLIENT,
    );
    if (userExist) {
      return JSON.parse(
        this.getItemFromLocalStorage(
          CommonConstants.KEY_EVALUATIONID_INDIRECT_CLIENT,
        ),
      );
    } else {
      return {};
    }
  }

  /**
   * Toggle to notify that notifications changed
   */
  toggleNotificationChange() {
    this.notificationChange.next(!this.isNotificationChange);
  }

  /**
   * To create new notifications.
   * @param usersId
   *  The user id to which the notification is targeted.
   * @param descriptionNodeName
   *  This is the name of the node where is the description in translate json files,
   *  the path of the description MUST be in 'shared.profile.notifications', because is the default path,
   *  if you want to add a new notification, first create a new node in this path, and send in this parameter
   *  the name of the node. Example: 'scrapingFinished'.
   * @param parameters
   *  The parameters are for when a notifications needs a variable,
   *  for example: 'The {{name}} scraping has been completed successfully.'. In this case the 'name' is
   *  the parameter, so you need to send an object like this one '{name: 'Inclutec'}'.
   *  Note: you can send multiple parameters.
   */
  public createNotification<T>(
    usersId: number,
    descriptionNodeName: string,
    parameters: any,
  ): Observable<T> {
    const userDetail = this.getItemFromLocalStorage('userDetail');
    const user = JSON.parse(userDetail);
    const token = user.userToken;
    const date = new Date();

    const notificationData = {
      date,
      descriptionPath: 'shared.profile.notifications.' + descriptionNodeName,
      id: 0,
      usersId,
      viewed: 0,
      parameters: JSON.stringify(parameters),
    };
    const url = `${this.config.API_ENDPOINT_EAW}Notifications?access_token=${token}`;
    const options = {headers: this.headers};
    return this.httpClient
      .post<any>(url, notificationData, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Check if the AccessToken of the user is still active.
   * @param token
   * @param id
   */
  public verifyAccessTokenStillActive<T>(
    token: string,
    id: number,
  ): Observable<T[]> {
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Users/${id}/accessTokens/${token}?access_token=${token}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Encrypt Data
   * @param encryptionKey
   * @param objEncrypt
   */
  private encryptData(encryptionKey: string, objEncrypt: any) {
    return crypto.AES.encrypt(objEncrypt, encryptionKey);
  }

  /**
   * Decrypt Data
   * @param encryptionKey
   * @param objDescrypt
   */
  private decryptData(encryptionKey: string, objDescrypt) {
    return crypto.AES.decrypt(objDescrypt, encryptionKey).toString(
      crypto.enc.Utf8,
    );
  }

  /**
   * Verify that the itemKey isn't in localStorage already
   * @param itemKey
   */
  public isItemInLocalStorage(itemKey: string) {
    if (localStorage.getItem(itemKey) == null) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Get data from localStorage by key
   * @param itemKey
   */
  public getItemFromLocalStorage(itemKey: string) {
    const item = localStorage.getItem(itemKey);
    if (item) {
      return this.decryptData(
        this.config.ENCRYPTION_KEY,
        localStorage.getItem(itemKey),
      );
    }
  }

  /**
   * Set data in localStorage by key
   * @param key
   * @param item
   */
  public setItemToLocalStorage(key: string, item: any) {
    localStorage.setItem(
      key,
      this.encryptData(this.config.ENCRYPTION_KEY, item),
    );
  }

  /**
   * Remove data in localStorage by key
   * @param key
   */
  public deleteItemFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  /**
   * Set temporal data that will be remove by the time set in localStorage by key
   * @param key
   * @param item
   * @param time
   */
  public setTemporalItemToLocalStorage(key: string, item: any, time: number) {
    localStorage.setItem(
      key,
      this.encryptData(this.config.ENCRYPTION_KEY, item),
    );
    setTimeout(() => localStorage.removeItem(key), time);
  }

  /**
   * Get User instance from local storage
   */
  getUserInfoFromLocalStorage(): User {
    const userExist = this.getItemFromLocalStorage(
      CommonConstants.KEY_USER_DETAILS,
    );
    if (userExist) {
      return JSON.parse(
        this.getItemFromLocalStorage(CommonConstants.KEY_USER_DETAILS),
      ) as User;
    } else {
      return new User();
    }
  }

  /**
   * Get EvaluationId from local storage
   */
  public getEvaluationId() {
    return this.getItemFromLocalStorage(
      CommonConstants.KEY_EVALUATIONID_INDIRECT_CLIENT,
    ) as number;
  }

  /**
   * Set a title in the tab browser
   * @param title
   */
  public setTitle(title: string) {
    this.titleService.setTitle(`${title}`);
  }

  public getTitle(){
    return this.titleService.getTitle();
  }

  /**
   * Check if High Contrast is active in Firefox/Safari.
   */
  public checkHC() {
    let objDiv;
    let strColor;
    objDiv = document.createElement('div');

    /*Set its color style to something unusual*/
    objDiv.style.color = 'rgb(255,105,180)';

    document.body.appendChild(objDiv);

    strColor = document.defaultView
      ? document.defaultView.getComputedStyle(objDiv, null).color
      : objDiv.currentStyle.color;
    strColor = strColor.replace(/ /g, '');

    if (strColor !== 'rgb(255,105,180)') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Get a list of generic models by status
   * @param modelName
   * @param status
   */
  public getModelListByStatus<T>(
    modelName: string,
    status: number = null,
  ): Observable<T[]> {
    const url = `${this.config.API_ENDPOINT_EAW}${modelName}`;
    const filter = status !== null ? {where: {isActive: status}} : {};
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<T[]>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get a list of generic models by status
   * @param modelName
   * @param status
   * @param filter
   */
  public getModelListByStatusFilter<T>(
    modelName: string,
    status: number = null,
    filterList: any,
  ): Observable<T[]> {
    const url = `${this.config.API_ENDPOINT_EAW}${modelName}`;
    const conditions = [{isActive: status}];
    const filter = status !== null ? {where: {and: conditions}} : {};
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<T[]>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update a generic model
   * @param modelName
   * @param modelData
   */
  public updateModel<T>(modelName: string, modelData: any): Observable<T> {
    const url = `${this.config.API_ENDPOINT_EAW}${modelName}/${modelData.id}`;
    const options = {headers: this.headers};
    return this.httpClient
      .patch<T>(url, modelData, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Createn a generic model
   * @param modelName
   * @param modelData
   */
  public createModel<T>(modelName: string, modelData: any): Observable<T> {
    const url = `${this.config.API_ENDPOINT_EAW}${modelName}`;
    const options = {headers: this.headers};
    return this.httpClient
      .post<T>(url, modelData, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Method to handle errors
   * @param error
   */
  public handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  /**
   * Format a specify date with a propose format
   * @param dateToFormat
   * @param proposedFormat
   */
  formatDate(dateToFormat: Date, proposedFormat: string = 'DD-MM-YYYY') {
    return moment(dateToFormat).format(proposedFormat);
  }

  /**
   * Service to find all promoters that match all conditions
   */
  getAllPromoters<T>(state: boolean = null): Observable<T> {
    const params = state == null ? `isActive='null'` : `isActive=${state}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Users/get-all-promoters?${params}`;
    return this.httpClient
      .get<T>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Service to find all evaluations
   */
  getAllEvaluations<T>(state): Observable<T> {
    const params = new HttpParams().set('state', JSON.stringify(state));
    const options = {
      headers: this.headers,
      params,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/get-all-evaluations`;
    return this.httpClient
      .get<T>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Service to find all failed evaluations
   */
    getAllFailedEvaluations<T>(): Observable<T> {
      const options = {
        headers: this.headers
      };
      const url = `${this.config.API_ENDPOINT_EAW}Evaluations/getAllFailedEvaluations`;
      return this.httpClient
        .get<T>(url, options)
        .pipe(retry(1), catchError(this.handleError));
    }
  

  /**
   * Service to find evaluations assing to evaluator by state
   */
  getEvaluationsByEvaluatorAndState<T>(
    evaluatorId: number,
    state: number = 0,
  ): Observable<T> {
    const params = new HttpParams()
      .set('evaluatorId', evaluatorId.toString())
      .set('state', state.toString());
    const options = {
      headers: this.headers,
      params,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/evaluations/state/evaluator/id`;
    return this.httpClient
      .get<T>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Service to get the checkpoint of the scraping in process
   * @param token
   * @param idEvaluation
   */
  getCheckpointByEvaluation<T>(
    token: string,
    idEvaluation: any,
  ): Observable<any> {
    const params = `?idEvaluation=${idEvaluation}&access_token=${token}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/lastestCheckpoint${params}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  getFinishScrapingInCheckpoint<T>(
    token: string,
    idEvaluation: any,
  ): Observable<any> {
    const params = `?idEvaluation=${idEvaluation}&access_token=${token}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/finishScrapingInCheckpoint${params}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  getResetScrapingInProgress<T>(
    token: string,
    idEvaluation: any,
  ): Observable<any> {
    const params = `?idEvaluation=${idEvaluation}&access_token=${token}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/resetScrapingInProgress${params}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  postStartEvaluation<T>(idEvaluation: any, idPackage: any): Observable<any> {
    const modelData = {
      idEvaluation,
      idPackage,
    };
    const user = this.getUserInfoFromLocalStorage();
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/startEvaluation?access_token=${user.userToken}`;
    const options = {headers: this.headers};
    return this.httpClient
      .post<any>(url, modelData, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  getSaveRandomSelectedPages<T>(idEvaluation: any): Observable<any> {
    const user = this.getUserInfoFromLocalStorage();
    const params = `?idEvaluation=${idEvaluation}&access_token=${user.userToken}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Pages/saveRandomSelectedPages${params}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Generate reports
   * @param idEvaluation
   * @param code
   */
  generateReports<T>(idEvaluation: any, code: any): Observable<any> {
    const user = this.getUserInfoFromLocalStorage();
    const params = `?idEvaluation=${idEvaluation}&evaluationCode=${code}&access_token=${user.userToken}`;
    const options = {
      headers: this.headers,
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/generateReport${params}`;
    return this.httpClient
      .get<any>(url, options)
      .pipe(retry(1), catchError(this.handleError));
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
   * Get info of an evaluation by id.
   * @param evaluationId
   */
  getEvaluation(evaluationId) {
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/evaluation-id`;
    const params = new HttpParams().set(
      'evaluationId',
      evaluationId.toString(),
    );
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<any>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get an evaluation's report filepaths
   * @param evaluationId
   */
  getEvaluationReportFilepaths(evaluationId) {
    const url = `${this.config.API_ENDPOINT_EAW}Reports/findOne`;
    const filter = {where: {evaluationsId: evaluationId}};
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    const options = {headers: this.headers, params};
    return this.httpClient
      .get<any>(url, options)
      .pipe(catchError(this.handleError));
  }

  public setEvaluationState(state : number){
    this.evaluationState = state;
  }

  public getEvaluationState(){
    return this.evaluationState;
  }

  public getPaginationState(){
    return this.paginationState;
  }

  public setPaginationState(paginationState){
    this.paginationState = paginationState;
  }

  public getPaginator(){
    return this.paginator;
  }

  public setPaginator(paginator){
    this.paginator = paginator;
  }
}

import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {retry} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';

import {CommonConstants} from '../../../common/common.constants';
import {SharedService} from '../../../shared/shared.service';
import {IAppConfig, APP_CONFIG} from '../../../../app.config';

/**
 * New evaluation services
 */
@Injectable()
export class EditEvaluationService extends SharedService {
  private isHideStepTwo: BehaviorSubject<boolean>;

  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    httpClient: HttpClient,
    public matDialog: MatDialog
  ) {
    super(config, httpClient);
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.isHideStepTwo = new BehaviorSubject<boolean>(false);
  }

  /* ToDo ToDos

  Para evaluaciones:
  + En pendientes: Antes de que se Seleccione o Genere páginas, se puede editar
      Editar el editar paquete: Ver Specifications and SpecificationsByEvaluation y evaluators, etc...
      Se puede cambiar todo menos: id, code.
      Restart scraping in progress.

  + En progreso:
      Nombre del sitio, segmento, etiqueta, plazo de evaluacion, (talvez el cliente).

  + En finalizadas: (Antes de generar el informe).
      Nombre del sitio, segmento, etiqueta.

    Si se necesita borrar: Detener el scraping y luego 'borrar'
  */

  /**
   * Service to find all evaluator that match with a specific disability
   */
  getAllEvaluatorByDisability<T>(disabilityId: number = null): Observable<T> {
    const params = `disabilityId=${disabilityId}`;
    const options = {
      headers: this.headers
    };
    const url = `${this.config.API_ENDPOINT_EAW}DisabilitiesByUsers/get-evaluators-by-disability?${params}`;
    return this.httpClient.get<T>(url, options).pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Service to find all segments that match with a specific client
   */
  getAllSegmentsByClients<T>(clientId: number = null): Observable<T> {
    const params = `clientId=${clientId}`;
    const options = {
      headers: this.headers
    };
    const url = `${this.config.API_ENDPOINT_EAW}ClientsBySegments/get-segments-by-client?${params}`;
    return this.httpClient.get<T>(url, options).pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Service to find all evaluator that match with rol of direct client
   */
  getAllDirectClients<T>() {
    const url = `${this.config.API_ENDPOINT_EAW}Users`;
    const filter = {where: {roleTypesId: CommonConstants.roles.DirectClient}};
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    const options = {headers: this.headers, params};
    return this.httpClient.get<any>(url, options).pipe(catchError(this.handleError));
  }

  /**
   * Service to create the evaluation
   * @param evaluationsToCreate
   */
  postEvaluations<T>(evaluationsToCreate: any) {
    const httpData = {
      evaluationData: evaluationsToCreate
    };
    const options = {
      headers: this.headers
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/post-evaluation`;
    return this.httpClient.post<any>(url, httpData, options).pipe(catchError(this.handleError));
  }

  /**
   * Set a state to the BehaviorSubject isHideStepTwo
   * @param mode
   */
  setHideStepTwo(mode: boolean): void {
    this.isHideStepTwo.next(mode);
  }

  /**
   * Return the BehaviorSubject isHideStepTwo
   */
  getHideStepTwo(): BehaviorSubject<boolean> {
    return this.isHideStepTwo;
  }

  /**
   * Service to find all sites names of evaluations created
   */
  getAllSitesNames<T>(): Observable<T> {
    const options = {
      headers: this.headers
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/get-all-sites-names`;
    return this.httpClient.get<T>(url, options).pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Getting a evaluation by its id, which is locate din  the url as a parameter
   */

  getEvaluationById<T>(evaluationId: string): Observable<T> {
    const options = {
      headers: this.headers
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/${evaluationId}`;
    return this.httpClient.get<T>(url, options).pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Getting evaluation dates by its id, which is locate in  the url as a parameter
   */

  getEvaluationDatesById<T>(evaluationId: string): Observable<T> {
    const options = {
      headers: this.headers
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/${evaluationId}/evaluationsDates`;
    return this.httpClient.get<T>(url, options).pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Getting evaluation specifications by its id, which is locate in  the url as a parameter
   */

  getEvaluationSpecificationsById<T>(evaluationId: string): Observable<T> {
    const options = {
      headers: this.headers
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/${evaluationId}/evaluationsSpecifications`;
    return this.httpClient.get<T>(url, options).pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Delete evaluation by id.
   * @param evaluationId
   */
  deleteEvaluation<T>(evaluationId: any, deletionJustification: any) {
    const httpData = {
      evaluationId,
      isDeleted: 1,
      deletionJustification: deletionJustification,
    };
    const options = {
      headers: this.headers
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/${evaluationId}`;
    console.log(deletionJustification);
    return this.httpClient.patch<any>(url, httpData, options).pipe(catchError(this.handleError));
  }

  /**
   * Function to change evaluation fields
   */
  patchEvaluation<T>(
    evaluationId: any,
    siteName: any,
    segmentsId: any,
    tagId: any,
    clientsId: any,
    date: any,
  ) {
    const httpData = {
      evaluationId,
      siteName,
      segmentsId,
      tagId,
      clientsId,
      date,
    };
    const options = {
      headers: this.headers
    };
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/${evaluationId}`;
    return this.httpClient.patch<any>(url, httpData, options).pipe(catchError(this.handleError));
  }
}

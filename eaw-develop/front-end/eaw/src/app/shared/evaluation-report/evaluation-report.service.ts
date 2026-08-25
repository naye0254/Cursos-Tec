import { Inject, Injectable } from '@angular/core';
import { SharedService } from '../shared.service';
import { APP_CONFIG, IAppConfig } from 'src/app.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { catchError } from 'rxjs/operators';

@Injectable()
export class EvaluationReportService extends SharedService {

  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    httpClient: HttpClient,
    public matDialog: MatDialog
  ) {
    super(config, httpClient);
   }

   //Calls the API to return a list of years where evaluations were applied
   getEvaluationsYears<T>(){
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/years`;
    const options = {};
    return this.httpClient.get<any>(url,options).pipe(catchError(this.handleError));
   }

   //Calls the API to get evaluations by years and state
   getEvaluationsByYear<T>(year : any, state){
    const params = `year=${year}&state=${state}`;
    const options = {};
    const url = `${this.config.API_ENDPOINT_EAW}Evaluations/getEvaluationsByYear?${params}`;
    return this.httpClient.get<any>(url,options).pipe(catchError(this.handleError));
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

  downloadReport(documentName: string) {
    const url = `${this.config.API_ENDPOINT_EAW}containers/reports/download/${documentName}`;
    return url;
  }
}

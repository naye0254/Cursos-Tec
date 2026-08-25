import {Component, OnInit} from '@angular/core';

import {SharedService} from '../../../../../shared/shared.service';
import {Evaluations} from '../../../../../models/evaluations.model';
import {CommonConstants} from '../../../../../common/common.constants';
import {ReportsService} from './reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
/**
 * Class for report component
 */
export class ReportsComponent implements OnInit {
  public evaluation: Evaluations;

  constructor(
    private sharedService: SharedService,
    private reportsService: ReportsService,
  ) {}

  ngOnInit() {
    this.evaluation = JSON.parse(
      this.sharedService.getItemFromLocalStorage('evaluationDetail'),
    );
  }

  /**
   * Valid if the reports are finished
   */
  public getReportFinishedState(): boolean {
    return (
      this.evaluation.managerialReportState ===
        CommonConstants.REPORT_STATES.FINISHED &&
      this.evaluation.technicalReportState ===
        CommonConstants.REPORT_STATES.FINISHED
    );
  }

  /**
   * Download the tecnical report
   */
  public async downloadTechnicalReport() {
    this.sharedService
      .getEvaluationReportFilepaths(this.evaluation.id)
      .pipe()
      .subscribe(data => {
        //Get the filename only from the
        const path = data['technicalReportPath'];
        const nameFile = path.substring(path.lastIndexOf('/') + 1);

        const url = this.reportsService.downloadReport(nameFile);
        window.open(url, '_blank');
      });
  }

  /**
   * Download the managerial report
   */
  public downloadManagerialReport() {
    this.sharedService
      .getEvaluationReportFilepaths(this.evaluation.id)
      .pipe()
      .subscribe(data => {
        //Get the filename only from the
        const path = data['managerialReportPath'];
        const nameFile = path.substring(path.lastIndexOf('/') + 1);

        const url = this.reportsService.downloadReport(nameFile);
        window.open(url, '_blank');
      });
  }
}

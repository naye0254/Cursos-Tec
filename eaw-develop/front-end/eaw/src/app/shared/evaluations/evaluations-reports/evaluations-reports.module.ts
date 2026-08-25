import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationsReportsRoutingModule } from './evaluations-reports-routing.module';
import { EvaluationReportsComponent } from './evaluation-reports/evaluation-reports.component';
import { EvaluationReportModule } from '../../../shared/evaluation-report/evaluation-report.module';

@NgModule({
  declarations: [EvaluationReportsComponent],
  imports: [
    CommonModule,
    EvaluationsReportsRoutingModule,
    EvaluationReportModule,
  ]
})
export class EvaluationsReportsModule { }

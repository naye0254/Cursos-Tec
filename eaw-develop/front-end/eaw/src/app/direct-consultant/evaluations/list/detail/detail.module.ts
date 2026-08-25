import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';

import {DetailRoutingModule, routedComponents} from './detail-routing.module';
import {StatisticsModule} from './statistics/statistics.module';
import {FindingsModule} from './findings/findings.module';
import {ReportsModule} from './reports/reports.module';
import {MaterialModule} from '../../../../material.module';
import {SharedService} from '../../../../shared/shared.service';
import {UtilsModule} from '../../../../utils/utils.module';
import {AlertService} from '../../../../utils/alerts/alerts.service';
import {TranslateSharedModule} from '../../../../shared/translateShared.module';
import {SharedModule} from '../../../../shared/shared.module';
import {LayoutModule} from '../../../../layout/layout.module';
import {SendResultComponent} from './modals/send-results/send-results.component';
import { EvaluationErrorComponent } from './error/evaluationerror.component';
import { EvaluationErrorService } from './error/evaluationerror.service';

@NgModule({
  imports: [
    CommonModule,
    DetailRoutingModule,
    StatisticsModule,
    FindingsModule,
    ReportsModule,
    MaterialModule,
    UtilsModule,
    TranslateSharedModule,
    SharedModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [routedComponents, SendResultComponent, EvaluationErrorComponent],
  providers: [SharedService, AlertService, EvaluationErrorService],
  entryComponents: [SendResultComponent],
})
export class DetailModule {}

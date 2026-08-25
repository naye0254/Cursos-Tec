import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  EvaluationReportRoutingModule,
  routedComponents,
} from './evaluation-report-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { UtilsModule } from 'src/app/utils/utils.module';
import { TranslateSharedModule } from '../translateShared.module';
import { LayoutModule } from '@angular/cdk/layout';
import { SharedService } from '../shared.service';
import { AlertService } from 'src/app/utils/alerts/alerts.service';

@NgModule({
  imports: [
    CommonModule,
    EvaluationReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    UtilsModule,
    TranslateSharedModule,
    LayoutModule,
  ],
  declarations: [routedComponents],
  exports: [routedComponents],
  providers: [SharedService, AlertService],
})
export class EvaluationReportModule {}

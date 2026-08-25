import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DetailRoutingModule} from './detail-routing.module';
import {StatisticsModule} from './statistics/statistics.module';
import {FindingsModule} from './findings/findings.module';
import {ReportsModule} from './reports/reports.module';

@NgModule({
  imports: [
    CommonModule,
    DetailRoutingModule,
    StatisticsModule,
    FindingsModule,
    ReportsModule,
  ],
})
export class DetailModule {}

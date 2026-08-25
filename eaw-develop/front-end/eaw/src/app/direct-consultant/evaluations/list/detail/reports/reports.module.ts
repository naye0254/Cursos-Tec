import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportsRoutingModule, routedComponents} from './reports-routing.module';

import {MaterialModule} from '../../../../../material.module';
import {TranslateSharedModule} from '../../../../../shared/translateShared.module';
import {ReportsService} from './reports.service';

@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MaterialModule,
    TranslateSharedModule,
  ],
  declarations: [routedComponents],
  providers: [ReportsService],
})
export class ReportsModule {}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxGraphModule} from '@swimlane/ngx-graph';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {TooltipModule} from 'ngx-tooltip';
import {TranslateSharedModule} from '../../../shared/translateShared.module';
import {MaterialModule} from '../../../material.module';
import {CounterListComponent} from './detail-evaluation/counter-list/counter-list.component';
import {LayoutModule} from '../../../layout/layout.module';
import {EvaluationsModule} from '../../../shared/list-evaluations/evaluation.module';

import {
  ListEvaluationsRoutingModule,
  routedComponents,
} from './list-evaluations-routing.module';

@NgModule({
  declarations: [routedComponents, CounterListComponent],
  imports: [
    CommonModule,
    ListEvaluationsRoutingModule,
    NgxGraphModule,
    NgxChartsModule,
    TooltipModule,
    TranslateSharedModule,
    MaterialModule,
    LayoutModule,
    EvaluationsModule,
  ],
  entryComponents: [CounterListComponent],
  exports: [routedComponents],
})
export class ListEvaluationsModule {}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EvaluationsQuantityComponent} from './evaluations-quantity/evaluations-quantity.component';
import {LayoutModule} from '../../layout/layout.module';
import {StatisticsRoutingModule, routedComponents} from './statistics-routing.module';
import {TranslateSharedModule} from '../../shared/translateShared.module';
import {SharedModule} from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    LayoutModule,
    SharedModule,
    TranslateSharedModule
  ],
  declarations: [routedComponents, EvaluationsQuantityComponent],
  exports: [routedComponents]
})
export class StatisticsModule {}

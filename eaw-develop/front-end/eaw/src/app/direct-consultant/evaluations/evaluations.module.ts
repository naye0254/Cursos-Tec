import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {
  EvaluationsRoutingModule,
  routedComponents,
} from './evaluations-routing.module';
import {LayoutModule} from '../../layout/layout.module';
import {MaterialModule} from '../../material.module';
import {TranslateSharedModule} from '../../shared/translateShared.module';

@NgModule({
  declarations: [routedComponents],
  exports: [routedComponents],
  imports: [
    CommonModule,
    EvaluationsRoutingModule,
    LayoutModule,
    MaterialModule,
    TranslateSharedModule,
  ],
})
export class EvaluationsModule {}

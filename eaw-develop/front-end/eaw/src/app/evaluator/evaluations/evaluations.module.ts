import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  EvaluationsRoutingModule,
  routedComponents,
} from './evaluations-routing.module';
import {LayoutModule} from '../../layout/layout.module';
import {EvaluationsModule} from '../../shared/list-evaluations/evaluation.module';
import {TranslateSharedModule} from '../../shared/translateShared.module';
import {MaterialModule} from '../../material.module';

@NgModule({
  declarations: [routedComponents],
  imports: [
    CommonModule,
    LayoutModule,
    EvaluationsModule,
    EvaluationsRoutingModule,
    TranslateSharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [routedComponents],
})
export class EvaluatorEvaluationsModule {}

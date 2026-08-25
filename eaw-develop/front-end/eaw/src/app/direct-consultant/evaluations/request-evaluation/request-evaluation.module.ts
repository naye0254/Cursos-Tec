import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  RequestEvaluationRoutingModule,
  routedComponents,
} from './request-evaluation-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {TranslateSharedModule} from '../../../shared/translateShared.module';
import {MaterialModule} from '../../../material.module';
import {UtilsModule} from '../../../utils/utils.module';

@NgModule({
  declarations: [routedComponents],
  exports: [routedComponents],
  imports: [
    CommonModule,
    RequestEvaluationRoutingModule,
    MaterialModule,
    SharedModule,
    TranslateSharedModule,
    FormsModule,
    ReactiveFormsModule,
    UtilsModule,
  ],
})
export class RequestEvaluationModule {}

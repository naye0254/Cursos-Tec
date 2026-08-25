import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EvaluationsRoutingModule, routedComponents} from './evaluations-routing.module';
import {LayoutModule} from '../../layout/layout.module';
import {MaterialModule} from '../../material.module';
import {TranslateSharedModule} from '../../shared/translateShared.module';
import {EvaluationsModule} from '../../shared/list-evaluations/evaluation.module';

@NgModule({
  declarations: [routedComponents],
  imports: [
    CommonModule,
    LayoutModule,
    EvaluationsRoutingModule,
    MaterialModule,
    TranslateSharedModule,
    EvaluationsModule
  ],
  exports: [routedComponents]
})
export class EvaluationsAdminModule {}

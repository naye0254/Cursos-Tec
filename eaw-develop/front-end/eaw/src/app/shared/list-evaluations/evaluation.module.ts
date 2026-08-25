import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '../../material.module';
import {SharedService} from '../../shared/shared.service';
import {UtilsModule} from '../../utils/utils.module';
import {AlertService} from '../../utils/alerts/alerts.service';
import {TranslateSharedModule} from '../../shared/translateShared.module';
import {LayoutModule} from '../../layout/layout.module';
import {SelectionPageComponent} from './list-evaluations/selection-page/selection-page.component';
import {CheckpointComponent} from './list-evaluations/checkpoint/checkpoint.component';

import {
  EvaluationsRoutingModule,
  routedComponents,
} from './evaluation-routing.module';

@NgModule({
  imports: [
    CommonModule,
    EvaluationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    UtilsModule,
    TranslateSharedModule,
    LayoutModule,
  ],
  declarations: [routedComponents, SelectionPageComponent, CheckpointComponent],
  exports: [routedComponents, SelectionPageComponent, CheckpointComponent],
  providers: [SharedService, AlertService],
  entryComponents: [SelectionPageComponent, CheckpointComponent],
})
export class EvaluationsModule {}

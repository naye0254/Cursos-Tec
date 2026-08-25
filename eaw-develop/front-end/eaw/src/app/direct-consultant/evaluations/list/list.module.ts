import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';

import {ListRoutingModule, routedComponents} from './list-routing.module';
import {DetailModule} from './detail/detail.module';

import {MaterialModule} from '../../../material.module';
import {SharedService} from '../../../shared/shared.service';
import {UtilsModule} from '../../../utils/utils.module';
import {AlertService} from '../../../utils/alerts/alerts.service';
import {TranslateSharedModule} from '../../../shared/translateShared.module';
import {SharedModule} from '../../../shared/shared.module';
import {LayoutModule} from '../../../layout/layout.module';
import {SelectionPageComponent} from '../../../shared/list-evaluations/list-evaluations/selection-page/selection-page.component';
import {EvaluationsModule} from '../../../shared/list-evaluations/evaluation.module';
@NgModule({
  imports: [
    CommonModule,
    ListRoutingModule,
    DetailModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    UtilsModule,
    TranslateSharedModule,
    SharedModule,
    LayoutModule,
    EvaluationsModule,
  ],
  providers: [SharedService, AlertService],
  declarations: [routedComponents],
  exports: [routedComponents],
  entryComponents: [SelectionPageComponent],
})
export class ListModule {}

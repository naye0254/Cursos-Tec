import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material.module';
import {SharedService} from '../../../shared/shared.service';
import {UtilsModule} from '../../../utils/utils.module';
import {AlertService} from '../../../utils/alerts/alerts.service';
import {TranslateSharedModule} from '../../../shared/translateShared.module';
import {LayoutModule} from '../../../layout/layout.module';
import {NewEvaluationRoutingModule, routedComponents} from './edit-evaluation-routing.module';
import {EditEvaluationService} from './edit-evaluation.service';

@NgModule({
  declarations: [routedComponents],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    UtilsModule,
    LayoutModule,
    TranslateSharedModule,
    NewEvaluationRoutingModule
  ],
  providers: [SharedService, AlertService, EditEvaluationService]
})
export class EditEvaluationModule {}

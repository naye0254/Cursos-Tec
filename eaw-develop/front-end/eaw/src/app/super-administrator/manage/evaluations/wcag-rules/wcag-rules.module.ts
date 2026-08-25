import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '../../../../material.module';
import {SharedService} from '../../../../shared/shared.service';
import {UtilsModule} from '../../../../utils/utils.module';
import {AlertService} from '../../../../utils/alerts/alerts.service';
import {TranslateSharedModule} from '../../../../shared/translateShared.module';
import {LayoutModule} from '../../../../layout/layout.module';
import {
  WcagRulesRoutingModule,
  routedComponents,
} from './wcag-rules-routing.module';

@NgModule({
  declarations: [routedComponents],
  imports: [
    CommonModule,
    WcagRulesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    UtilsModule,
    TranslateSharedModule,
    LayoutModule,
  ],
  exports: [routedComponents],
  providers: [SharedService, AlertService],
})
export class WcagRulesModule {}

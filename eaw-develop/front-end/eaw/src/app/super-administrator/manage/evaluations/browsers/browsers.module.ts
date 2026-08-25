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
  BrowsersRoutingModule,
  routedComponents,
} from './browsers-routing.module';

@NgModule({
  declarations: [routedComponents],
  imports: [
    CommonModule,
    BrowsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateSharedModule,
    LayoutModule,
    UtilsModule,
    MaterialModule,
  ],
  exports: [routedComponents],
  providers: [SharedService, AlertService],
})
export class BrowsersModule {}

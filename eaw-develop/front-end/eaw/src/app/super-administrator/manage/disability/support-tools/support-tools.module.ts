import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateSharedModule} from '../../../../shared/translateShared.module';

import {MaterialModule} from '../../../../material.module';
import {SharedService} from '../../../../shared/shared.service';
import {UtilsModule} from '../../../../utils/utils.module';
import {AlertService} from '../../../../utils/alerts/alerts.service';
import {LayoutModule} from '../../../../layout/layout.module';
import {
  SupportToolsRoutingModule,
  routedComponents,
} from './support-tools-module-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SupportToolsRoutingModule,
    ReactiveFormsModule,
    TranslateSharedModule,
    MaterialModule,
    UtilsModule,
    LayoutModule,
  ],
  declarations: [routedComponents],
  exports: [routedComponents],
  providers: [SharedService, AlertService],
})
export class SupportToolsModuleModule {}

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
  TypeDisabilityRoutingModule,
  routedComponents,
} from './type-disability-routing.module';

@NgModule({
  declarations: [routedComponents],
  exports: [routedComponents],
  imports: [
    CommonModule,
    TypeDisabilityRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    UtilsModule,
    TranslateSharedModule,
    LayoutModule,
  ],
  providers: [SharedService, AlertService],
})
export class TypeDisabilityModule {}

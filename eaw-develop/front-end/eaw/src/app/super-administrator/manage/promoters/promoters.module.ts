import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '../../../material.module';
import {SharedService} from '../../../shared/shared.service';
import {AlertService} from '../../../utils/alerts/alerts.service';
import {TranslateSharedModule} from '../../../shared/translateShared.module';
import {LayoutModule} from '../../../layout/layout.module';

import {
  PromotersRoutingModule,
  routedComponents,
} from './promoters-routing.module';

@NgModule({
  declarations: [routedComponents],
  exports: [routedComponents],
  imports: [
    CommonModule,
    PromotersRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateSharedModule,
    LayoutModule,
  ],
  providers: [SharedService, AlertService],
})
export class PromotersModule {}

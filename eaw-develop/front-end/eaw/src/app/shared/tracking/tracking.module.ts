import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {
  TrackingRoutingModule,
  routedComponents,
} from './tracking-routing.module';
import {MaterialModule} from '../../material/material-module';
import {SharedService} from '../../shared/shared.service';
import {TranslateSharedModule} from '../../shared/translateShared.module';
import {LayoutModule} from '../../layout/layout.module';
import {TrackingService} from './tracking.service';

@NgModule({
  declarations: [routedComponents],
  imports: [
    CommonModule,
    TrackingRoutingModule,
    MaterialModule,
    TranslateSharedModule,
    LayoutModule,
  ],
  providers: [SharedService, TrackingService],
})
export class TrackingModule {}

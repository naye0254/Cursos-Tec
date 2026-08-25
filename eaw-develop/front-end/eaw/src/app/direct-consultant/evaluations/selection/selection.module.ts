import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {
  SelectionRoutingModule,
  routedComponents,
} from './selection-routing.module';
import {MaterialModule} from '../../../material.module';
import {TranslateSharedModule} from '../../../shared/translateShared.module';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SelectionRoutingModule,
    MaterialModule,
    TranslateSharedModule,
    SharedModule,
  ],
  declarations: [routedComponents],
  exports: [routedComponents],
})
export class SelectionModule {}

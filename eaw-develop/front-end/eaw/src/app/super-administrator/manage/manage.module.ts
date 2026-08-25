import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ManageRoutingModule, routedComponents} from './manage-routing.module';
import {LayoutModule} from '../../layout/layout.module';

import {TranslateSharedModule} from '../../shared/translateShared.module';

@NgModule({
  imports: [
    CommonModule,
    ManageRoutingModule,
    LayoutModule,
    TranslateSharedModule,
  ],
  declarations: [routedComponents],
  exports: [routedComponents],
})
export class ManageModule {}

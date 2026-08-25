import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../../material/material-module';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {AlertService} from '../../utils/alerts/alerts.service';
import {ClientsRoutingModule, routedComponents} from './clients-routing.module';
import {UtilsModule} from '../../utils/utils.module';
import {LayoutModule} from './../../layout/layout.module';
import {TranslateSharedModule} from '../../shared/translateShared.module';
import {SharedService} from '../../shared/shared.service';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [routedComponents],
  exports: [routedComponents],
  imports: [
    LayoutModule,
    CommonModule,
    ClientsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    UtilsModule,
    TranslateSharedModule,
    SharedModule,
  ],
  providers: [AlertService, SharedService],
})
export class ClientsModule {}

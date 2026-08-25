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
import {EditClientComponent} from './edit-client/edit-client.component';

@NgModule({
  declarations: [routedComponents, EditClientComponent],
  exports: [routedComponents, EditClientComponent],
  imports: [
    LayoutModule,
    CommonModule,
    ClientsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    UtilsModule,
    TranslateSharedModule,
  ],
  providers: [AlertService, SharedService],
  entryComponents: [EditClientComponent],
})
export class ClientsModule {}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InternationalPhoneNumberModule} from 'ngx-international-phone-number';

import {
  LandingPageRoutingModule,
  routedComponents,
} from './landing-page-routing.module';

import {LayoutModule} from './layout/layout.module';
import {UserRestoreService} from './user-restore/user-restore.service';
import {TranslateSharedModule} from '../shared/translateShared.module';
import {UtilsModule} from '../utils/utils.module';
import {AlertService} from './../utils/alerts/alerts.service';
import {MaterialModule} from './../material.module';
import {ContactService} from './contact/contact.service';

@NgModule({
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    InternationalPhoneNumberModule,
    TranslateSharedModule,
    UtilsModule,
    MaterialModule,
  ],
  declarations: [routedComponents],
  exports: [routedComponents],
  providers: [UserRestoreService, AlertService, ContactService],
})
export class LandingPageModule {}

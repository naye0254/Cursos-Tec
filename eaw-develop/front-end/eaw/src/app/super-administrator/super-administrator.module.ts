import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {
  SuperAdministratorRoutingModule,
  routedComponents
} from './super-administrator-routing.module';
import {UtilsModule} from '../utils/utils.module';
import {AlertService} from '../utils/alerts/alerts.service';
import {ConfirmationModalService} from '../utils/confirmation-modal/confirmation-modal.service';
import {LayoutModule} from '../layout/layout.module';
import {TranslateSharedModule} from '../shared/translateShared.module';
import {SharedModule} from '../shared/shared.module';
import {TokenInterceptor} from '../shared/token.interceptor';
import {ProfileComponent} from './profile/profile.component';

@NgModule({
  imports: [
    CommonModule,
    SuperAdministratorRoutingModule,
    UtilsModule,
    LayoutModule,
    TranslateSharedModule,
    SharedModule
  ],
  declarations: [routedComponents, ProfileComponent],
  exports: [routedComponents, TranslateSharedModule],
  providers: [
    AlertService,
    ConfirmationModalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})
export class SuperAdministratorModule {}

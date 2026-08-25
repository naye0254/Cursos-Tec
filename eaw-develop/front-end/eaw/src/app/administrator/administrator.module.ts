import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {
  AdministratorRoutingModule,
  routedComponents,
} from './administrator-routing.module';
import {UtilsModule} from '../utils/utils.module';
import {AlertService} from '../utils/alerts/alerts.service';
import {ConfirmationModalService} from '../utils/confirmation-modal/confirmation-modal.service';
import {LayoutModule} from '../layout/layout.module';
import {TranslateSharedModule} from '../shared/translateShared.module';
import {SharedModule} from '../shared/shared.module';

import {PrincipalPageComponent} from './principal-page/principal-page.component';
import {ProfileComponent} from './profile/profile.component';
import {TokenInterceptor} from '../shared/token.interceptor';

@NgModule({
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    UtilsModule,
    LayoutModule,
    TranslateSharedModule,
    SharedModule,
  ],
  declarations: [routedComponents, PrincipalPageComponent, ProfileComponent],
  exports: [routedComponents, TranslateSharedModule],
  providers: [
    AlertService,
    ConfirmationModalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
})
export class AdministratorModule {}

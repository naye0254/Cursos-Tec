import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  DirectConsultantRoutingModule,
  routedComponents,
} from './direct-consultant-routing.module';

import {UtilsModule} from '../utils/utils.module';
import {AlertService} from '../utils/alerts/alerts.service';
import {LayoutModule} from '../layout/layout.module';
import {TranslateSharedModule} from '../shared/translateShared.module';
import {SharedModule} from '../shared/shared.module';
import {TokenInterceptor} from '../shared/token.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ConfirmationModalService} from '../utils/confirmation-modal/confirmation-modal.service';

@NgModule({
  imports: [
    CommonModule,
    DirectConsultantRoutingModule,
    UtilsModule,
    LayoutModule,
    TranslateSharedModule,
    SharedModule,
  ],
  declarations: [routedComponents],
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
export class DirectConsultantModule {}

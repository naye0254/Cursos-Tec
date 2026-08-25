import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {
  IndirectConsultantRoutingModule,
  routedComponents,
} from './indirect-consultant-routing.module';

import {UtilsModule} from '../utils/utils.module';
import {AlertService} from '../utils/alerts/alerts.service';
import {LayoutModule} from '../layout/layout.module';
import {TranslateSharedModule} from '../shared/translateShared.module';
import {SharedModule} from '../shared/shared.module';
import {TokenInterceptor} from '../shared/token.interceptor';
import {ConfirmationModalService} from '../utils/confirmation-modal/confirmation-modal.service';

@NgModule({
  imports: [
    CommonModule,
    IndirectConsultantRoutingModule,
    UtilsModule,
    LayoutModule,
    TranslateSharedModule,
    SharedModule,
  ],
  exports: [routedComponents, TranslateSharedModule],
  declarations: [routedComponents],
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
export class IndirectConsultantModule {}

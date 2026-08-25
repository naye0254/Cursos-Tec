import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {
  EvaluatorRoutingModule,
  routedComponents,
} from './evaluator-routing.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {UtilsModule} from '../utils/utils.module';
import {AlertService} from '../utils/alerts/alerts.service';
import {ConfirmationModalService} from '../utils/confirmation-modal/confirmation-modal.service';
import {LayoutModule} from '../layout/layout.module';
import {TranslateSharedModule} from '../shared/translateShared.module';
import {SharedModule} from '../shared/shared.module';
import {AddRecommendationComponent} from './manual-evaluation/modals/add-recommendation/add-recommendation.component';
import {EvaluationUnfinishComponent} from './manual-evaluation/modals/evaluation-unfinish/evaluation-unfinish.component';
import {DirectivesModule} from '../directives/directives.module';

import {TokenInterceptor} from '../shared/token.interceptor';
import {MaterialModule} from '../material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    routedComponents,
    AddRecommendationComponent,
    EvaluationUnfinishComponent,
  ],
  imports: [
    DirectivesModule,
    CommonModule,
    EvaluatorRoutingModule,
    UtilsModule,
    LayoutModule,
    TranslateSharedModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [AddRecommendationComponent, EvaluationUnfinishComponent],
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
export class EvaluatorModule {}

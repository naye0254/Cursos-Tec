import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TextMaskModule} from 'angular2-text-mask';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {Ng2OrderModule} from 'ng2-order-pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import {HighlightModule} from 'ngx-highlightjs';
import {NgxSpinnerModule} from 'ngx-spinner';

import {MaterialModule} from '../../../../../material.module';

import {
  FindingsRoutingModule,
  routedComponents,
} from './findings-routing.module';

import {UtilsModule} from '../../../../../utils/utils.module';
import {TranslateSharedModule} from '../../../../../shared/translateShared.module';

@NgModule({
  imports: [
    CommonModule,
    FindingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
    NgxPaginationModule,
    HighlightModule,
    UtilsModule,
    NgxSpinnerModule,
    MaterialModule,
    TranslateSharedModule,
  ],
  declarations: [routedComponents],
})
export class FindingsModule {}

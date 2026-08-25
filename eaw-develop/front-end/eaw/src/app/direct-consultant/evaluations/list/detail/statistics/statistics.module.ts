import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TextMaskModule} from 'angular2-text-mask';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {Ng2OrderModule} from 'ng2-order-pipe';
import {NgxPaginationModule} from 'ngx-pagination';

import {HighlightModule} from 'ngx-highlightjs';
import {NgxSpinnerModule} from 'ngx-spinner';
import {DataTablesModule} from 'angular-datatables';

import {ChartModule, HIGHCHARTS_MODULES} from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import * as exportdata from 'highcharts/modules/export-data.src';
import * as accesibility from 'highcharts/modules/accessibility.src';
import * as sankey from 'highcharts/modules/sankey.src';
import * as PatternFill2 from 'highcharts-pattern-fill/pattern-fill-v2';

import {
  StatisticsRoutingModule,
  routedComponents,
} from './statistics-routing.module';

import {HighchartsComponent} from './highcharts/highcharts.component';
import {StatisticsService} from './statistics.service';
import {UtilsModule} from '../../../../../utils/utils.module';
import {TranslateSharedModule} from '../../../../../shared/translateShared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StatisticsRoutingModule,
    TranslateSharedModule,
    ChartModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
    DataTablesModule,
    HighlightModule,
    NgxSpinnerModule,
    TextMaskModule,
    UtilsModule,
    NgxPaginationModule,
  ],
  providers: [
    StatisticsService,
    {
      provide: HIGHCHARTS_MODULES,
      useFactory: () => [
        more,
        exporting,
        accesibility,
        exportdata,
        sankey,
        PatternFill2,
      ],
    },
  ],
  declarations: [routedComponents, HighchartsComponent],
})
export class StatisticsModule {}

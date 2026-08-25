import {SharedService} from '../../../shared/shared.service';
import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {APP_CONFIG, AppConfig} from '../../../../app.config';
import {TranslateSharedModule} from '../../../shared/translateShared.module';
import {SharedModule} from '../../../shared/shared.module';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslatePipe} from '@ngx-translate/core';

import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {
  TranslateCacheModule,
  TranslateCacheSettings,
  TranslateCacheService,
} from 'ngx-translate-cache';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/languages/', '.json');
}

export function TranslateCacheFactory(
  translateService,
  translateCacheSettings,
) {
  return new TranslateCacheService(translateService, translateCacheSettings);
}

@Pipe({
  name: 'translate',
})
export class TranslatePipeMock implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@NgModule({
  imports: [
    NoopAnimationsModule,
    HttpClientModule,
    TranslateSharedModule,
    SharedModule,
    RouterTestingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (httpClient: HttpClient) =>
          new TranslateHttpLoader(httpClient),
        deps: [HttpClient],
      },
    }),
    TranslateCacheModule.forRoot({
      cacheService: {
        provide: TranslateCacheService,
        useFactory: TranslateCacheFactory,
        deps: [TranslateService, TranslateCacheSettings],
      },
    }),
  ],
  providers: [
    {
      provide: APP_CONFIG,
      useValue: AppConfig,
    },
    {provide: TranslatePipe, useClass: TranslatePipeMock},
    SharedService,
  ],
  exports: [SharedModule, TranslatePipeMock, TranslateModule],
  declarations: [TranslatePipeMock],
})
export class SharedTestingTranslateModule {}

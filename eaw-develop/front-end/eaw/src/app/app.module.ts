import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {DatePipe} from '@angular/common';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material-module';

import {LandingPageModule} from './landing-page/landing-page.module';
import {DirectConsultantModule} from './direct-consultant/direct-consultant.module';
import {IndirectConsultantModule} from './indirect-consultant/indirect-consultant.module';

import {LayoutModule} from './layout/layout.module';
import {UtilsModule} from './utils/utils.module';
import {SharedModule} from './shared/shared.module';
import {APP_CONFIG, AppConfig} from '../app.config';
import {TokenInterceptor} from './shared/token.interceptor';

import {AuthGuardService} from './utils/can-activate/auth-guard.service';

import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {
  TranslateCacheModule,
  TranslateCacheSettings,
  TranslateCacheService
} from 'ngx-translate-cache';

import {HIGHLIGHT_OPTIONS} from 'ngx-highlightjs';

import xml from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';

export function hljsLanguages() {
  return [
    {name: 'typescript', func: typescript},
    {name: 'javascript', func: javascript},
    {name: 'scss', func: scss},
    {name: 'xml', func: xml}
  ];
}

/**
 * For load and specify where the languages files are.
 * @param http
 */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/languages/', '.json');
}

/**
 * Factory of translation cache.
 * @param translateService
 * @param translateCacheSettings
 */
export function TranslateCacheFactory(translateService, translateCacheSettings) {
  return new TranslateCacheService(translateService, translateCacheSettings);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LandingPageModule,
    DirectConsultantModule,
    IndirectConsultantModule,
    LayoutModule,
    UtilsModule,
    SharedModule,
    RouterModule,
    MaterialModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    TranslateCacheModule.forRoot({
      cacheService: {
        provide: TranslateCacheService,
        useFactory: TranslateCacheFactory,
        deps: [TranslateService, TranslateCacheSettings]
      }
    })
  ],
  providers: [
    {
      provide: APP_CONFIG,
      useValue: AppConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        languages: hljsLanguages
      }
    },
    AuthGuardService,
    DatePipe
  ],
  bootstrap: [AppComponent],
  exports: [HttpClientModule]
})
export class AppModule {}

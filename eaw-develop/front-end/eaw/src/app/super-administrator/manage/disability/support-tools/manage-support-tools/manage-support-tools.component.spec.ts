import {Component, NgModule} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateSharedModule} from '../../../../../shared/translateShared.module';
import {APP_CONFIG, AppConfig} from '../../../../../../app.config';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {
  TranslateCacheModule,
  TranslateCacheSettings,
  TranslateCacheService,
} from 'ngx-translate-cache';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule, MatDialog, MatDialogRef} from '@angular/material';
import {OverlayContainer} from '@angular/cdk/overlay';

import {MaterialModule} from '../../../../../material.module';
import {ManageSupportToolsComponent} from './manage-support-tools.component';
import {LayoutModule} from '../../../../../layout/layout.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/languages/', '.json');
}

export function TranslateCacheFactory(
  translateService,
  translateCacheSettings,
) {
  return new TranslateCacheService(translateService, translateCacheSettings);
}

describe('ManageSupportToolsComponent', () => {
  let dialog: MatDialog;
  let overlayContainerElement: HTMLElement;
  let noop: ComponentFixture<NoopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DialogTestModule],
      declarations: [],
      providers: [
        {
          provide: OverlayContainer,
          useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return {getContainerElement: () => overlayContainerElement};
          },
        },
      ],
    });
    dialog = TestBed.get(MatDialog);
    noop = TestBed.createComponent(NoopComponent);
  }));

  it('should create', () => {
    expect(noop).toBeTruthy();
  });
});

@Component({
  template: '',
})
class NoopComponent {}

const TEST_DIRECTIVES = [ManageSupportToolsComponent, NoopComponent];

@NgModule({
  imports: [
    MatDialogModule,
    NoopAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateSharedModule,
    LayoutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
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
    NoopAnimationsModule,
  ],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [ManageSupportToolsComponent],
  providers: [
    {
      provide: APP_CONFIG,
      useValue: AppConfig,
    },
  ],
})
class DialogTestModule {}

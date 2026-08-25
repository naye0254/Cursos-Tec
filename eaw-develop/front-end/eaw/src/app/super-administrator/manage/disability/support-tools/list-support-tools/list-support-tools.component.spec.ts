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

import {MaterialModule} from '../../../../../material.module';
import {ListSupportToolsComponent} from './list-support-tools.component';
import {LayoutModule} from '../../../../../layout/layout.module';
import {SupportToolsService} from '../support-tools.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/languages/', '.json');
}

export function TranslateCacheFactory(
  translateService,
  translateCacheSettings,
) {
  return new TranslateCacheService(translateService, translateCacheSettings);
}

describe('ListSupportToolsComponent', () => {
  let component: ListSupportToolsComponent;
  let fixture: ComponentFixture<ListSupportToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
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
      declarations: [ListSupportToolsComponent],
      providers: [
        SupportToolsService,
        {
          provide: APP_CONFIG,
          useValue: AppConfig,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSupportToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

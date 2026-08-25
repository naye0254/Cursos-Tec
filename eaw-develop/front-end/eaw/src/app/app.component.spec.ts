import {TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';

import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material-module';

import {DirectConsultantModule} from './direct-consultant/direct-consultant.module';
import {IndirectConsultantModule} from './indirect-consultant/indirect-consultant.module';

import {LayoutModule} from './layout/layout.module';
import {UtilsModule} from './utils/utils.module';
import {SharedModule} from './shared/shared.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        DirectConsultantModule,
        IndirectConsultantModule,
        LayoutModule,
        UtilsModule,
        SharedModule,
        RouterModule,
        MaterialModule,
      ],
      declarations: [AppComponent],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'eaw'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('eaw');
  });
});

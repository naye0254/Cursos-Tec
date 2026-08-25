import {Component, NgModule} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ObserversModule} from '@angular/cdk/observers';
import {OverlayContainer} from '@angular/cdk/overlay';
import {
  MatDialogModule,
  MatLabel,
  MatError,
  MatHint,
  MatFormField,
  MatRadioButton,
  MatRadioGroup,
  MatDialog,
  MatRippleModule,
} from '@angular/material';

import {ManagePromoterComponent} from './manage-promoter.component';

describe('ManagePromoterComponent', () => {
  let dialog: MatDialog;
  let overlayContainerElement: HTMLElement;

  let noop: ComponentFixture<NoopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ManagePromoterTestModule],
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
  });

  it('should create', () => {
    expect(noop).toBeTruthy();
  });
});

@Component({
  template: '',
})
class NoopComponent {}

const TEST_DIRECTIVES = [
  ManagePromoterComponent,
  NoopComponent,
  MatLabel,
  MatError,
  MatHint,
  MatFormField,
  MatRadioButton,
  MatRadioGroup,
];

@NgModule({
  imports: [
    MatDialogModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ObserversModule,
    MatRippleModule,
  ],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [ManagePromoterComponent],
})
class ManagePromoterTestModule {}

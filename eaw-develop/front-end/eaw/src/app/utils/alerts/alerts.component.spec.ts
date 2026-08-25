import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, NgModule} from '@angular/core';
import {MatDialogModule, MatDialog, MatDialogRef} from '@angular/material';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {OverlayContainer} from '@angular/cdk/overlay';
import {AlertsComponent} from './alerts.component';

describe('AlertsComponent', () => {
  let dialogAlert: MatDialog;
  let overlayContainerElement: HTMLElement;
  let dialogRefAlert: MatDialogRef<AlertsComponent>;

  let noop: ComponentFixture<NoopAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AlertsTestModule],
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

    dialogAlert = TestBed.get(MatDialog);

    noop = TestBed.createComponent(NoopAlertsComponent);
  }));

  it('shows error information', () => {
    const config = {
      data: {
        title: 'Error',
        text: 'Seguro que desea eliminar el contenido',
        type: 'error',
      },
    };
    dialogRefAlert = dialogAlert.open(AlertsComponent, config);

    noop.detectChanges();

    const h1 = overlayContainerElement.querySelector('h1');
    expect(h1.textContent.trim()).toBe(config.data.title);
    const icon = overlayContainerElement.querySelector('.fa-info-circle');
    expect(icon).not.toEqual(null);
    dialogRefAlert.close();
  });

  it('shows succes information', () => {
    const config = {
      data: {
        title: 'Success',
        text: 'Fue exitoso',
        type: 'éxito',
      },
    };
    dialogRefAlert = dialogAlert.open(AlertsComponent, config);

    noop.detectChanges();

    const h1 = overlayContainerElement.querySelector('h1');
    expect(h1.textContent.trim()).toBe(config.data.title);
    const icon = overlayContainerElement.querySelector('.fa-check-circle');
    expect(icon).not.toEqual(null);
    dialogRefAlert.close();
  });

  it('shows warning information', () => {
    const config = {
      data: {
        title: 'Warning',
        text: 'Alerta',
        type: 'advertencia',
      },
    };
    dialogRefAlert = dialogAlert.open(AlertsComponent, config);

    noop.detectChanges();

    const h1 = overlayContainerElement.querySelector('h1');
    expect(h1.textContent.trim()).toBe(config.data.title);
    const icon = overlayContainerElement.querySelector(
      '.fa-exclamation-triangle',
    );
    expect(icon).not.toEqual(null);
    dialogRefAlert.close();
  });

  it('it should closes the alert', () => {
    const config = {
      data: {
        title: 'Warning',
        text: 'Alerta',
        type: 'advertencia',
        confirmFn() {},
      },
    };
    dialogRefAlert = dialogAlert.open(AlertsComponent, config);

    noop.detectChanges();

    const okButton = overlayContainerElement.querySelector(
      '#focusable',
    ) as HTMLButtonElement;

    okButton.dispatchEvent(new Event('click'));
    okButton.click();

    noop.detectChanges();
    expect(dialogRefAlert.getState()).toBe(1);
    dialogRefAlert.close();
  });
});

@Component({
  template: '',
})
class NoopAlertsComponent {}

const TEST_DIRECTIVES = [AlertsComponent, NoopAlertsComponent];

@NgModule({
  imports: [MatDialogModule, NoopAnimationsModule],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [AlertsComponent],
})
class AlertsTestModule {}

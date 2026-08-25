import {Component, NgModule} from '@angular/core';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {MatDialogModule, MatDialog, MatDialogRef} from '@angular/material';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {OverlayContainer} from '@angular/cdk/overlay';

import {ConfirmationModalComponent} from './confirmation-modal.component';

describe('ConfirmationModalComponent', () => {
  let dialog: MatDialog;
  let overlayContainerElement: HTMLElement;
  let dialogRef: MatDialogRef<ConfirmationModalComponent>;

  let noop: ComponentFixture<NoopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DialogTestModule],
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

  it('shows information on call', () => {
    const config = {
      data: {
        title: '¿ Eliminar ?',
        body: 'Seguro que desea eliminar el contenido',
        cancel: 'cancelar',
        next: 'continuar',
      },
    };

    dialogRef = dialog.open(ConfirmationModalComponent, config);

    noop.detectChanges();

    const h1 = overlayContainerElement.querySelector('h1');
    const p = overlayContainerElement.querySelector('#description');
    const cancelBtn = overlayContainerElement.querySelector('#cancel-button');
    const okBtn = overlayContainerElement.querySelector('#ok-button');
    expect(h1.textContent).toBe(config.data.title);
    expect(p.textContent).toBe(config.data.body);
    expect(cancelBtn.textContent.trim()).toBe(config.data.cancel);
    expect(okBtn.textContent.trim()).toBe(config.data.next);
    dialogRef.close();
  });

  it('should call the cancel button and close the modal ', () => {
    const config = {
      data: {
        title: '¿ Eliminar ?',
        body: 'Seguro que desea eliminar el contenido',
        cancel: 'cancelar',
        next: 'continuar',
        cancelFn() {},
      },
    };
    dialogRef = dialog.open(ConfirmationModalComponent, config);

    noop.detectChanges();
    const cancelBtn = overlayContainerElement.querySelector(
      '#cancel-button',
    ) as HTMLButtonElement;

    cancelBtn.dispatchEvent(new Event('click'));
    cancelBtn.click();

    noop.detectChanges();
    expect(dialogRef.getState()).toBe(1);
    dialogRef.close();
  });

  it('should call the ok button and close the modal ', () => {
    const config = {
      data: {
        title: '¿ Eliminar ?',
        body: 'Seguro que desea eliminar el contenido',
        cancel: 'cancelar',
        next: 'continuar',
        confirmFn() {},
      },
    };
    dialogRef = dialog.open(ConfirmationModalComponent, config);

    noop.detectChanges();
    const okButton = overlayContainerElement.querySelector(
      '#ok-button',
    ) as HTMLButtonElement;

    okButton.dispatchEvent(new Event('click'));
    okButton.click();

    noop.detectChanges();
    expect(dialogRef.getState()).toBe(1);
    dialogRef.close();
  });
});

@Component({
  template: '',
})
class NoopComponent {}

const TEST_DIRECTIVES = [ConfirmationModalComponent, NoopComponent];

@NgModule({
  imports: [MatDialogModule, NoopAnimationsModule],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [ConfirmationModalComponent],
})
class DialogTestModule {}

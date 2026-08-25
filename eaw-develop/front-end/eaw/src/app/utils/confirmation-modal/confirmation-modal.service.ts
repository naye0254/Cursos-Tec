import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {ConfirmationModalComponent} from './confirmation-modal.component';

@Injectable()
export class ConfirmationModalService {
  constructor(public matDialog: MatDialog) {}

  openConfirmDialog(
    title: string,
    body: string,
    btnOkText: string,
    btnCancelText: string,
    confirmFn: () => void,
    cancelFn: () => void,
  ): void {
    this.matDialog.open(ConfirmationModalComponent, {
      width: '65vh',
      data: {
        title,
        body,
        cancel: btnCancelText,
        next: btnOkText,
        confirmFn() {
          confirmFn();
        },
        cancelFn() {
          cancelFn();
        },
      },
    });
  }
}

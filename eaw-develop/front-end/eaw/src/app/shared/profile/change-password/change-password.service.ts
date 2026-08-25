import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {ChangePasswordComponent} from './change-password.component';

@Injectable()
/**
 * Service to open a dialog
 */
export class ChangePasswordService {
  /**
   * Constructor of the class
   * @param matDialog
   */
  constructor(public matDialog: MatDialog) {}

  /**
   * Open a dialog
   * @param widthModal
   * @param confirmFn
   * @param cancelFn
   */
  public openDialog(
    widthModal: string,
    confirmFn: () => void,
    cancelFn: () => void,
  ): void {
    this.matDialog.open(ChangePasswordComponent, {
      width: widthModal,
      data: {
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

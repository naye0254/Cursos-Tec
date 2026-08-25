import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {ManagePromoterComponent} from './manage-promoter.component';

@Injectable()
export class ManagePromoterService {
  constructor(public matDialog: MatDialog) {}

  /**
   * Open the dialig to manage the promoters
   * @param title
   * @param btnOkText
   * @param btnCancelText
   * @param widthModal
   * @param type
   * @param confirmFn
   * @param cancelFn
   * @param model
   */
  openDialog(
    title: string,
    btnOkText: string,
    btnCancelText: string,
    widthModal: string,
    type: number,
    confirmFn: () => void,
    cancelFn: () => void,
    model: any = null,
  ): void {
    this.matDialog.open(ManagePromoterComponent, {
      width: widthModal,
      data: {
        title,
        type,
        cancel: btnCancelText,
        next: btnOkText,
        model,
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

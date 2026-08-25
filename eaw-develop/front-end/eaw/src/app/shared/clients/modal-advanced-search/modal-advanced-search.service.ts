import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {ModalAdvancedSearchComponent} from './modal-advanced-search.component';

@Injectable()
export class AdvancedSearchService {
  constructor(public matDialog: MatDialog) {}

  /**
   * Open the dialig to manage the promoters
   * @param title
   * @param btnOkText
   * @param btnCancelText
   * @param widthModal
   * @param confirmFn
   * @param cancelFn
   */
  openDialog(
    title: string,
    btnOkText: string,
    btnCancelText: string,
    widthModal: string,
    confirmFn: () => void,
    cancelFn: () => void,
  ) {
    const dialogRef = this.matDialog.open(ModalAdvancedSearchComponent, {
      width: widthModal,
      data: {
        title,
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
    return dialogRef;
  }
}

import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {ManageSupportToolsComponent} from './manage-support-tools.component';

@Injectable()
export class ManageSupportToolsService {
  constructor(public matDialog: MatDialog) {}

  /**
   * Open the dialig to manage the promoters
   * @param title
   * @param btnOkText
   * @param widthModal
   * @param type
   * @param confirmFn
   * @param cancelFn
   * @param model
   */
  openDialog(
    title: string,
    btnOkText: string,
    widthModal: string,
    type: number,
    confirmFn: () => void,
    cancelFn: () => void,
    model: any = null,
  ): void {
    this.matDialog.open(ManageSupportToolsComponent, {
      width: widthModal,
      data: {
        title,
        type,
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

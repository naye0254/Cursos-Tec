import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {ManageSegmentComponent} from './manage-segment.component';

@Injectable()
/**
 * Service to open a dialog
 */
export class ManageSegmentService {
  /**
   * Constructor of the class
   * @param matDialog
   */
  constructor(public matDialog: MatDialog) {}

  /**
   * Open a dialog
   * @param title
   * @param body
   * @param btnOkText
   * @param btnCancelText
   * @param widthModal
   * @param type 0 if is for new, 1 if is for update
   * @param confirmFn
   * @param cancelFn
   * @param model model to update, null if is for new
   */
  public openDialog(
    title: string,
    body: string,
    btnOkText: string,
    btnCancelText: string,
    widthModal: string,
    type: number,
    confirmFn: () => void,
    cancelFn: () => void,
    model: any = null,
  ): void {
    this.matDialog.open(ManageSegmentComponent, {
      width: widthModal,
      data: {
        title,
        body,
        type,
        model,
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

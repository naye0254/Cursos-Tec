import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {EvaluationUnfinishComponent} from './evaluation-unfinish.component';

@Injectable()
/**
 * Service to open a dialog
 */
export class EvaluationUnfinishService {
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
    list: any,
    cancelFn: () => void,
    confirmFn: () => void,
  ): void {
    this.matDialog.open(EvaluationUnfinishComponent, {
      width: widthModal,
      maxHeight: '95vh',
      data: {
        list,
        cancelFn() {
          cancelFn();
        },
        confirmFn() {
          confirmFn();
        },
      },
    });
  }
}

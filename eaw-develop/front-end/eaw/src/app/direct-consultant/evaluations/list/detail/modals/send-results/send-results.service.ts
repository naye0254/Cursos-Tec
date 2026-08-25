import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {SendResultComponent} from './send-results.component';

@Injectable()
/**
 * Service to open a dialog
 */
export class SendResultService {
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
    evaluationId: number,
    confirmFn: () => void,
  ): void {
    this.matDialog.open(SendResultComponent, {
      width: widthModal,
      maxHeight: '95vh',
      data: {
        evaluationId,
        confirmFn() {
          confirmFn();
        },
      },
    });
  }
}

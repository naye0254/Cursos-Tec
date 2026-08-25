import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {CheckpointComponent} from './checkpoint.component';

@Injectable()
/**
 * Service to open a dialog
 */
export class CheckpointService {
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
    idEvaluation: any,
    confirmFn: () => void,
  ): void {
    this.matDialog.open(CheckpointComponent, {
      width: widthModal,
      maxHeight: '95vh',
      data: {
        idEvaluation,
        confirmFn() {
          confirmFn();
        },
      },
    });
  }
}

import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {SelectionPageComponent} from './selection-page.component';

@Injectable()
/**
 * Service to open a modal
 */
export class SelectionPageService {
  /**
   * Constructor method
   * @param matDialog
   */
  constructor(private matDialog: MatDialog) {}

  /**
   * Open a modal with evaluation value
   * @param evaluation
   * @param confirmFn
   * @param cancelFn
   */
  openDialog(evaluation: any, confirmFn: () => void, cancelFn: () => void) {
    const dialogRef = this.matDialog.open(SelectionPageComponent, {
      width: '60%',
      height: '95vh',
      data: {
        evaluation,
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

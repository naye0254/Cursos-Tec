import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {CriteriaInfoComponent} from './criteria-info.component';

@Injectable()
/**
 * Service to open a dialog
 */
export class CriteriaInfoService {
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
    numberCriteria: string,
    title: string,
    text: string,
    referenceLink: string,
    confirmFn: () => void,
  ): void {
    this.matDialog.open(CriteriaInfoComponent, {
      width: widthModal,
      maxHeight: '95vh',
      data: {
        numberCriteria,
        title,
        text,
        referenceLink,
        confirmFn() {
          confirmFn();
        },
      },
    });
  }
}

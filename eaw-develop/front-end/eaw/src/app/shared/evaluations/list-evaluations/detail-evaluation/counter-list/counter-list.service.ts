import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {CounterListComponent} from './counter-list.component';

@Injectable()
/**
 * Service to open a dialog
 */
export class CounterListService {
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
    counter: string,
    title: string,
    text: string,
    list: any,
    confirmFn: () => void,
    cancelFn: () => void,
  ): void {
    this.matDialog.open(CounterListComponent, {
      width: widthModal,
      maxHeight: '95vh',
      data: {
        counter,
        title,
        text,
        list,
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

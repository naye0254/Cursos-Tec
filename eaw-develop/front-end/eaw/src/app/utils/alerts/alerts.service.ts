import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {AlertsComponent} from './alerts.component';

/**
 * Service to open an alert
 */
@Injectable()
export class AlertService {
  constructor(public matDialog: MatDialog) {}

  /**
   * Open an alert
   * @param title
   * @param text
   * @param type
   * @param confirmFn
   */
  openAlert(
    title: string,
    text: string,
    type: string,
    confirmFn: () => void,
  ): void {
    this.matDialog.open(AlertsComponent, {
      width: '65vh',
      role: 'alertdialog',
      data: {
        type,
        title,
        text,
        confirmFn() {
          confirmFn();
        },
      },
    });
  }
}

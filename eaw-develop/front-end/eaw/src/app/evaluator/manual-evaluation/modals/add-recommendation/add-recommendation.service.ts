import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {AddRecommendationComponent} from './add-recommendation.component';

@Injectable()
/**
 * Service to open a dialog
 */
export class AddRecommendationService {
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
    principleName: string,
    principleId: any,
    manualPageId: any,
    cancelFn: () => void,
    confirmFn: () => void,
  ): void {
    this.matDialog.open(AddRecommendationComponent, {
      width: widthModal,
      maxHeight: '95vh',
      data: {
        principleName,
        principleId,
        manualPageId,
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

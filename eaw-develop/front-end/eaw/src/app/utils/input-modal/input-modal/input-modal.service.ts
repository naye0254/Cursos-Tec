import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import { InputModalComponent } from './input-modal.component';

@Injectable()
export class InputModalService {
  private deletionJustification = null;
  constructor(public matDialog: MatDialog) {}

  openConfirmDialog(
    title: string,
    body: string,
    btnOkText: string,
    btnCancelText: string,
    confirmFn: () => void,
    cancelFn: () => void,
  ): void {
    this.matDialog.open(InputModalComponent, {
      width: '65vh',
      data: {
        title,
        body,
        cancel: btnCancelText,
        next: btnOkText,
        confirmFn() {
          confirmFn();
        },
        cancelFn() {
          cancelFn();
        },
        inputModalService: this,
      },
    });
  }

  public setDeleteJustification(deletionJustification){
    this.deletionJustification = deletionJustification;
  }

  public getDeleteJustification(){
    return this.deletionJustification;
  }
}


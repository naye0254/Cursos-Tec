import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {EditClientComponent} from './edit-client.component';

@Injectable()
export class EditClientService {
  constructor(public matDialog: MatDialog) {}

  openDialog(client: any, confirmFn: () => void, cancelFn: () => void) {
    const dialogRef = this.matDialog.open(EditClientComponent, {
      width: '40%',
      data: {
        client,
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

import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { InputModalService } from './input-modal.service';

@Component({
  selector: 'app-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.scss']
})
export class InputModalComponent {
  deletionJustification: string;
  constructor(
    public dialogRef: MatDialogRef<InputModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  cancel(): void {
    this.data.cancelFn();
    this.dialogRef.close();
  }

  confirmFunction() {
    this.data.inputModalService.setDeleteJustification(this.deletionJustification);
    this.data.confirmFn();
    this.dialogRef.close();
  }
}

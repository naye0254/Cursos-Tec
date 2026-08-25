import {Component, AfterViewChecked, Inject} from '@angular/core';

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-language-config',
  templateUrl: './language-config.component.html',
  styleUrls: ['./language-config.component.scss'],
})
export class LanguageConfigComponent implements AfterViewChecked {
  constructor(
    public dialogRef: MatDialogRef<LanguageConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngAfterViewChecked() {
    setTimeout(() => {
      window.location.reload();
    }, 7000);
  }
}

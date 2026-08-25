import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  MatSidenavModule,
  MatIconModule,
  MatCardModule,
  MatSelectModule,
  MatChipsModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatTableModule,
  MatMenuModule,
  MatDialogModule,
  MatTabsModule,
  MatStepperModule,
} from '@angular/material';
import {OverlayModule} from '@angular/cdk/overlay';

@NgModule({
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSidenavModule,
    MatIconModule,
    MatCardModule,
    OverlayModule,
    MatSelectModule,
    MatChipsModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatTableModule,
    MatMenuModule,
    MatDialogModule,
    MatTabsModule,
    MatStepperModule,
  ],
  declarations: [],
})
export class MaterialModule {}

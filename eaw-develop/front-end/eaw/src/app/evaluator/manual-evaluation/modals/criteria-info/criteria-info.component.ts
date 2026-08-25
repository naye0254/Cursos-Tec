import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {Subject} from 'rxjs';

import {GenericModal} from '../.../../../../../shared/abstract-classes/modals/generic-modal.abstract';
import {SharedService} from '../.../../../../../shared/shared.service';
import {AlertService} from '../.../../../../../utils/alerts/alerts.service';

@Component({
  selector: 'app-criteria-info',
  templateUrl: './criteria-info.component.html',
  styleUrls: ['./criteria-info.component.scss'],
})
export class CriteriaInfoComponent extends GenericModal
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public translatePath = 'evaluator.manualEvaluation.modals.criteriaInfo';

  /**
   * Constructor criteria-info
   * @param dialogRef
   * @param translate
   * @param sharedService
   * @param alertService
   * @param data
   */
  constructor(
    public dialogRef: MatDialogRef<CriteriaInfoComponent>,
    private translate: TranslateService,
    private sharedService: SharedService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Cancel event
   */
  public cancel(): void {
    this.dialogRef.close();
  }

  /**
   * Confirm event
   */
  public confirm(): void {
    this.data.confirmFn();
    this.dialogRef.close();
  }
}

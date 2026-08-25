import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {Subject} from 'rxjs';

import {GenericModal} from '../../../../../shared/abstract-classes/modals/generic-modal.abstract';
import {SharedService} from '../../../../../shared/shared.service';
import {AlertService} from '../../../../../utils/alerts/alerts.service';

@Component({
  selector: 'app-counter-list',
  templateUrl: './counter-list.component.html',
  styleUrls: ['./counter-list.component.scss'],
})
export class CounterListComponent extends GenericModal
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public translatePath = '';

  /**
   * Constructor counter-list
   * @param dialogRef
   * @param translate
   * @param sharedService
   * @param alertService
   * @param data
   */
  constructor(
    public dialogRef: MatDialogRef<CounterListComponent>,
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
    this.data.cancelFn();
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

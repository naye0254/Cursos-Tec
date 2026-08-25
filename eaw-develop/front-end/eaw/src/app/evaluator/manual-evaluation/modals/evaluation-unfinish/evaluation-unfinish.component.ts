import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {Subject} from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';

import {GenericModal} from '../../../../shared/abstract-classes/modals/generic-modal.abstract';
import {SharedService} from '../../../../shared/shared.service';
import {AlertService} from '../../../../utils/alerts/alerts.service';

@Component({
  selector: 'app-evaluation-unfinish',
  templateUrl: './evaluation-unfinish.component.html',
  styleUrls: ['./evaluation-unfinish.component.scss'],
})
export class EvaluationUnfinishComponent extends GenericModal
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public translatePath = 'evaluator.manualEvaluation.modals.evaluationUnfinish';
  public formPrinciple: FormGroup;

  /**
   * Constructor evaluation-unfinish
   * @param dialogRef
   * @param translate
   * @param sharedService
   * @param alertService
   * @param data
   */
  constructor(
    public dialogRef: MatDialogRef<EvaluationUnfinishComponent>,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private sharedService: SharedService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
  }

  /**
   * Initialize the form.
   */
  initForm() {
    this.formPrinciple = this.formBuilder.group({
      recommendation: new FormControl('', [Validators.maxLength(2500)]),
    });
  }

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

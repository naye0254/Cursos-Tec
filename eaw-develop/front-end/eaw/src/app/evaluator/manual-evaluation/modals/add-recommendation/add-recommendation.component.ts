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
import {ManualEvaluationService} from '../../manual-evaluation.service';

@Component({
  selector: 'app-add-recommendation',
  templateUrl: './add-recommendation.component.html',
  styleUrls: ['./add-recommendation.component.scss'],
  providers: [ManualEvaluationService],
})
export class AddRecommendationComponent extends GenericModal
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public user: any;
  public translatePath = 'evaluator.manualEvaluation.modals.addRecommendation';
  public formPrinciple: FormGroup;

  /**
   * Constructor add-recommendation
   * @param dialogRef
   * @param translate
   * @param sharedService
   * @param alertService
   * @param data
   */
  constructor(
    public dialogRef: MatDialogRef<AddRecommendationComponent>,
    private formBuilder: FormBuilder,
    private manualEvaluationService: ManualEvaluationService,
    private translate: TranslateService,
    private sharedService: SharedService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super();
  }

  ngOnInit() {
    this.user = this.sharedService.getUserInfoFromLocalStorage();
    this.manualEvaluationService
      .getPersonalRecommendation(
        this.data.principleId,
        +this.data.manualPageId,
        this.user.userToken,
      )
      .subscribe(data => {
        this.formPrinciple.patchValue({
          recommendation: data.results.observation,
        });
      });

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
  public confirm(formData: any): void {
    this.manualEvaluationService
      .savePersonalRecommendation(
        this.data.principleId,
        +this.data.manualPageId,
        formData.recommendation,
        this.user.userToken,
      )
      .subscribe(data => {
        this.data.confirmFn();
        this.dialogRef.close();
      });
  }
}

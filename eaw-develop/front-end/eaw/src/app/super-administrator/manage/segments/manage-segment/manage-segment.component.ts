import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

import {GenericModal} from '../../../../shared/abstract-classes/modals/generic-modal.abstract';
import {SegmentsConstants} from '../segments.constants';
import {Segments} from '../../../../models/segments.model';
import {Country} from '../../../../models/country';
import {AlertService} from '../../../../utils/alerts/alerts.service';
import {SharedService} from '../../../../shared/shared.service';
import {CommonConstants} from '../../../../common/common.constants';

@Component({
  selector: 'app-manage-segment',
  templateUrl: './manage-segment.component.html',
  styleUrls: ['./manage-segment.component.scss'],
  providers: [SegmentsConstants, AlertService],
})

/**
 * Class component to manage segments
 * Extends GenericModal to reuse shared functions
 */
export class ManageSegmentComponent extends GenericModal
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public segmentForm: FormGroup;
  public formOptions: any;
  public listCountries: any;
  public errorAlertObj: any;
  public successAlertObj: any;
  public translatePath: string;

  constructor(
    public dialogRef: MatDialogRef<ManageSegmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private sharedService: SharedService,
    private translate: TranslateService,
  ) {
    super();
    this.errorAlertObj = {};
    this.successAlertObj = {};
    this.translatePath = 'superAdministrator.manage.alerts.segment';
    this.formOptions = SegmentsConstants.FORM_MANAGE_SEGMENT_OPTIONS;
    this.segmentForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthName),
      ]),
      countryId: new FormControl(0, [Validators.required]),
      isActive: new FormControl('1', [Validators.required]),
    });
    this.loadForm();
    this.listCountries = [];
  }

  ngOnInit() {
    this.getAllActiveCountries();
    this.getTranslationsAlerts();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Servide for traductions
   */
  getTranslationsAlerts() {
    this.translate
      .get(this.translatePath + '.success')
      .subscribe((res: any) => {
        this.successAlertObj = {
          text1: res.text1,
          text2: res.text2,
          createTitle: res.createTitle,
          updateTitle: res.updateTitle,
        };
      });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate
        .get(this.translatePath + '.success')
        .subscribe((res: any) => {
          this.successAlertObj = {
            text1: res.text1,
            text2: res.text2,
            createTitle: res.createTitle,
            updateTitle: res.updateTitle,
          };
        });
    });
    this.translate.get(this.translatePath + '.error').subscribe((res: any) => {
      this.errorAlertObj = {
        text: res.text,
        createTitle: res.createTitle,
        updateTitle: res.updateTitle,
      };
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate
        .get(this.translatePath + '.error')
        .subscribe((res: any) => {
          this.errorAlertObj = {
            text: res.text,
            createTitle: res.createTitle,
            updateTitle: res.updateTitle,
          };
        });
    });
  }

  /**
   * Load general data in the form
   */
  private loadForm() {
    if (this.data.type === CommonConstants.MODAL_STATUS.UPDATE) {
      this.segmentForm.patchValue(this.data.model);
      this.loadRadioButtons();
    }
  }

  /**
   * Get all actives countries for the multi select
   */
  getAllActiveCountries(): void {
    this.sharedService
      .getModelListByStatus<Country>('Countries', 1)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listCountries = data;
      });
  }

  /**
   * Load radio button in the form
   */
  private loadRadioButtons(): void {
    this.segmentForm.controls.isActive.setValue(
      this.data.model.isActive.toString(),
    );
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
  public confirmFunction(): void {
    const supportToolItem = this.segmentForm.value as Segments;
    if (this.data.type === CommonConstants.MODAL_STATUS.NEW) {
      supportToolItem.id = 0;
      supportToolItem.createdAt = new Date();
      supportToolItem.createdBy = this.sharedService.getUserInfoFromLocalStorage().id;
      this.createItemModel(
        'Segments',
        supportToolItem,
        () => {
          this.success(
            this.successAlertObj.createTitle,
            `${this.successAlertObj.text1} ${supportToolItem.name} ${this.successAlertObj.text2}`,
            this.alertService,
            () => {
              this.data.confirmFn();
              this.dialogRef.close();
            },
          );
        },
        () => {
          this.error(
            this.errorAlertObj.createTitle,
            `${this.errorAlertObj.text} ${supportToolItem.name}`,
            this.alertService,
            () => {},
          );
        },
        this.sharedService,
      );
    } else if (this.data.type === CommonConstants.MODAL_STATUS.UPDATE) {
      supportToolItem.id = this.data.model.id;
      supportToolItem.updatedAt = new Date();
      supportToolItem.updatedBy = this.sharedService.getUserInfoFromLocalStorage().id;
      supportToolItem.createdAt = this.data.createdAt;
      supportToolItem.createdBy = this.data.createdBy;
      this.updateItemModel(
        'Segments',
        supportToolItem,
        () => {
          this.success(
            this.successAlertObj.updateTitle,
            `${this.successAlertObj.text1} ${supportToolItem.name} ${this.successAlertObj.text2}`,
            this.alertService,
            () => {
              this.data.confirmFn();
              this.dialogRef.close();
            },
          );
        },
        () => {
          this.error(
            this.errorAlertObj.updateTitle,
            `${this.errorAlertObj.text} ${supportToolItem.name}`,
            this.alertService,
            () => {},
          );
        },
        this.sharedService,
      );
    }
  }
}

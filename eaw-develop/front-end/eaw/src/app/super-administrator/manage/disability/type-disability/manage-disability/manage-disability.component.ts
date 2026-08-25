import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

import {TypeDisablitiesConstants} from '../type-disability.constants';
import {Disabilities} from '../../../../../models/disabilities.model';
import {SharedService} from '../../../../../shared/shared.service';
import {AlertService} from '../../../../../utils/alerts/alerts.service';
import {CommonConstants} from '../../../../../common/common.constants';
import {GenericModal} from '../../../../../shared/abstract-classes/modals/generic-modal.abstract';

@Component({
  selector: 'app-manage-disability',
  templateUrl: './manage-disability.component.html',
  styleUrls: ['./manage-disability.component.scss'],
})
/**
 * Class component to manage Disabilities
 * Extends GenericModal to reuse shared functions
 */
export class ManageDisabilityComponent extends GenericModal
  implements OnDestroy, OnInit {
  public disabilityForm: FormGroup;
  public formOptions: any;
  public errorAlertObj: any;
  public successAlertObj: any;
  public translatePath: string;

  /**
   * Constructor component
   * @param dialogRef
   * @param data of the modal
   * @param formBuilder
   * @param sharedService
   * @param alertService
   */
  constructor(
    public dialogRef: MatDialogRef<ManageDisabilityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private alertService: AlertService,
    private translate: TranslateService,
  ) {
    super();
    this.errorAlertObj = {};
    this.successAlertObj = {};
    this.translatePath = 'superAdministrator.manage.alerts.disabilityType';
    this.formOptions = TypeDisablitiesConstants.FORM_MANAGE_DISABILITY_OPTIONS;
    this.disabilityForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputFirstName),
      ]),
      isActive: new FormControl('1', [Validators.required]),
    });
    this.loadForm();
  }

  ngOnInit() {
    this.getTranslationsAlerts();
  }

  ngOnDestroy() {
    this.unSubscribe();
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
      this.disabilityForm.patchValue(this.data.model);
      this.loadRadioButtons();
    }
  }

  /**
   * Load radio button in the form
   */
  private loadRadioButtons() {
    this.disabilityForm.controls.isActive.setValue(
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
    const disabilityItem = this.disabilityForm.value as Disabilities;
    if (this.data.type === CommonConstants.MODAL_STATUS.NEW) {
      disabilityItem.id = 0;
      disabilityItem.createdAt = new Date();
      disabilityItem.createdBy = this.sharedService.getUserInfoFromLocalStorage().id;
      this.createItemModel(
        'Disabilities',
        disabilityItem,
        () => {
          this.success(
            this.successAlertObj.createTitle,
            `${this.successAlertObj.text1} ${disabilityItem.name} ${this.successAlertObj.text2}`,
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
            `${this.errorAlertObj.text} ${disabilityItem.name}`,
            this.alertService,
            () => {},
          );
        },
        this.sharedService,
      );
    } else if (this.data.type === CommonConstants.MODAL_STATUS.UPDATE) {
      disabilityItem.id = this.data.model.id;
      disabilityItem.updatedAt = new Date();
      disabilityItem.updatedBy = this.sharedService.getUserInfoFromLocalStorage().id;
      disabilityItem.createdAt = this.data.model.createdAt;
      disabilityItem.createdBy = this.data.model.createdBy;
      this.updateItemModel(
        'Disabilities',
        disabilityItem,
        () => {
          this.success(
            this.successAlertObj.updateTitle,
            `${this.successAlertObj.text1} ${disabilityItem.name} ${this.successAlertObj.text2}`,
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
            `${this.errorAlertObj.text} ${disabilityItem.name}`,
            this.alertService,
            () => {},
          );
        },
        this.sharedService,
      );
    }
  }
}

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';

import {PackagesConstants} from '../packages.constants';
import {Packages} from '../../../../../models/packages.model';
import {SharedService} from '../../../../../shared/shared.service';
import {AlertService} from '../../../../../utils/alerts/alerts.service';
import {CommonConstants} from '../../../../../common/common.constants';
import {GenericModal} from '../../../../../shared/abstract-classes/modals/generic-modal.abstract';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-manage-package',
  templateUrl: './manage-package.component.html',
  styleUrls: ['./manage-package.component.scss'],
  providers: [PackagesConstants, CommonConstants],
})
/**
 * Class component to manage packages
 * Extends GenericModal to reuse shared functions
 */
export class ManagePackageComponent extends GenericModal
  implements OnDestroy, OnInit {
  public packageForm: FormGroup;
  public formOptions: any;
  public errorAlertObj: any;
  public successAlertObj: any;
  public translatePath = 'superAdministrator.manage.alerts.package';

  /**
   * Constructor component
   * @param dialogRef
   * @param data of the modal
   * @param formBuilder
   * @param sharedService
   * @param alertService
   */
  constructor(
    public dialogRef: MatDialogRef<ManagePackageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private alertService: AlertService,
    private translate: TranslateService,
  ) {
    super();
    this.formOptions = PackagesConstants.FORM_MANAGE_PROMOTER_OPTIONS;
    this.packageForm = this.formBuilder.group({
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
      this.packageForm.patchValue(this.data.model);
      this.loadRadioButtons();
    }
  }

  /**
   * Load radio button in the form
   */
  private loadRadioButtons() {
    this.packageForm.controls.isActive.setValue(
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
    const packageItem = this.packageForm.value as Packages;
    if (this.data.type === CommonConstants.MODAL_STATUS.NEW) {
      packageItem.id = 0;
      packageItem.createdAt = new Date();
      packageItem.createdBy = this.sharedService.getUserInfoFromLocalStorage().id;
      this.createItemModel(
        'Packages',
        packageItem,
        () => {
          this.success(
            this.successAlertObj.createTitle,
            `${this.successAlertObj.text1} ${packageItem.name} ${this.successAlertObj.text2}`,
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
            `${this.errorAlertObj.text} ${packageItem.name}`,
            this.alertService,
            () => {},
          );
        },
        this.sharedService,
      );
    } else if (this.data.type === CommonConstants.MODAL_STATUS.UPDATE) {
      packageItem.id = this.data.model.id;
      packageItem.updatedAt = new Date();
      packageItem.updatedBy = this.sharedService.getUserInfoFromLocalStorage().id;
      packageItem.createdAt = this.data.createdAt;
      packageItem.createdBy = this.data.createdBy;
      this.updateItemModel(
        'Packages',
        packageItem,
        () => {
          this.success(
            this.successAlertObj.updateTitle,
            `${this.successAlertObj.text1} ${packageItem.name} ${this.successAlertObj.text2}`,
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
            `${this.errorAlertObj.text} ${packageItem.name}`,
            this.alertService,
            () => {},
          );
        },
        this.sharedService,
      );
    }
  }
}

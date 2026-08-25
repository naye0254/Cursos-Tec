import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

import {GenericModal} from '../../../../../shared/abstract-classes/modals/generic-modal.abstract';
import {DevicesConstants} from '../devices.constants';
import {Devices} from '../../../../../models/devices.model';
import {AlertService} from '../../../../../utils/alerts/alerts.service';
import {SharedService} from '../../../../../shared/shared.service';
import {CommonConstants} from '../../../../../common/common.constants';
import {OperativeSystems} from '../../../../../models/operativeSystems.model';

@Component({
  selector: 'app-manage-devices',
  templateUrl: './manage-devices.component.html',
  styleUrls: ['./manage-devices.component.scss'],
  providers: [DevicesConstants, AlertService],
})

/**
 * Class component to manage devices
 * Extends GenericModal to reuse shared functions
 */
export class ManageDevicesComponent extends GenericModal
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public deviceForm: FormGroup;
  public formOptions: any;
  public listOperativeSystems: OperativeSystems[];
  public errorAlertObj: any;
  public successAlertObj: any;
  public translatePath: string;

  constructor(
    public dialogRef: MatDialogRef<ManageDevicesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private sharedService: SharedService,
    private translate: TranslateService,
  ) {
    super();
    this.errorAlertObj = {};
    this.successAlertObj = {};
    this.translatePath = 'superAdministrator.manage.alerts.device';
    this.formOptions = DevicesConstants.FORM_MANAGE_DEVICE_OPTIONS;
    this.deviceForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputName),
      ]),
      brand: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputBrand),
      ]),
      version: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputVersion),
      ]),
      operativeSystemId: new FormControl(0, [Validators.required]),
      isActive: new FormControl('1', [Validators.required]),
    });
    this.loadForm();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  ngOnInit() {
    this.getTranslationsAlerts();
    this.getAllActiveOperativeSystems();
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
      this.deviceForm.patchValue(this.data.model);
      this.loadRadioButtons();
    }
  }

  /**
   * Load radio button in the form
   */
  private loadRadioButtons(): void {
    this.deviceForm.controls.isActive.setValue(
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
   * Get all actives operative systems for the
   */
  getAllActiveOperativeSystems(): void {
    this.sharedService
      .getModelListByStatus<OperativeSystems>('OperativeSystems', 1)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listOperativeSystems = data;
      });
  }

  /**
   * Confirm event
   */
  public confirmFunction(): void {
    const deviceItem = this.deviceForm.value as Devices;
    if (this.data.type === CommonConstants.MODAL_STATUS.NEW) {
      deviceItem.id = 0;
      deviceItem.createdAt = new Date();
      deviceItem.createdBy = this.sharedService.getUserInfoFromLocalStorage().id;
      this.createItemModel(
        'Devices',
        deviceItem,
        () => {
          this.success(
            this.successAlertObj.createTitle,
            `${this.successAlertObj.text1} ${deviceItem.name} ${this.successAlertObj.text2}`,
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
            `${this.errorAlertObj.text} ${deviceItem.name}`,
            this.alertService,
            () => {},
          );
        },
        this.sharedService,
      );
    } else if (this.data.type === CommonConstants.MODAL_STATUS.UPDATE) {
      deviceItem.id = this.data.model.id;
      deviceItem.updatedAt = new Date();
      deviceItem.updatedBy = this.sharedService.getUserInfoFromLocalStorage().id;
      deviceItem.createdAt = this.data.createdAt;
      deviceItem.createdBy = this.data.createdBy;
      this.updateItemModel(
        'Devices',
        deviceItem,
        () => {
          this.success(
            this.successAlertObj.updateTitle,
            `${this.successAlertObj.text1} ${deviceItem.name} ${this.successAlertObj.text2}`,
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
            `${this.errorAlertObj.text} ${deviceItem.name}`,
            this.alertService,
            () => {},
          );
        },
        this.sharedService,
      );
    }
  }
}

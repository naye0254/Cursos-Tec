import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

import {GenericModal} from '../../../../../shared/abstract-classes/modals/generic-modal.abstract';
import {BrowsersConstants} from '../browsers.constants';
import {Browsers} from '../../../../../models/browsers.model';
import {AlertService} from '../../../../../utils/alerts/alerts.service';
import {SharedService} from '../../../../../shared/shared.service';
import {CommonConstants} from '../../../../../common/common.constants';

@Component({
  selector: 'app-manage-browsers',
  templateUrl: './manage-browsers.component.html',
  styleUrls: ['./manage-browsers.component.scss'],
  providers: [BrowsersConstants, AlertService],
})

/**
 * Class component to manage browsers
 * Extends GenericModal to reuse shared functions
 */
export class ManageBrowsersComponent extends GenericModal
  implements OnDestroy, OnInit {
  protected onDestroy = new Subject<void>();
  public browserForm: FormGroup;
  public formOptions: any;
  public errorAlertObj: any;
  public successAlertObj: any;
  public translatePath: string;

  constructor(
    public dialogRef: MatDialogRef<ManageBrowsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private sharedService: SharedService,
    private translate: TranslateService,
  ) {
    super();
    this.errorAlertObj = {};
    this.successAlertObj = {};
    this.translatePath = 'superAdministrator.manage.alerts.browser';
    this.formOptions = BrowsersConstants.FORM_MANAGE_BROWSER_OPTIONS;
    this.browserForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputName),
      ]),
      browserVersion: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputBrand),
      ]),
      isActive: new FormControl('1', [Validators.required]),
    });
    this.loadForm();
  }

  ngOnInit(): void {
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
      this.browserForm.patchValue(this.data.model);
      this.loadRadioButtons();
    }
  }

  /**
   * Load radio button in the form
   */
  private loadRadioButtons(): void {
    this.browserForm.controls.isActive.setValue(
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
    const browserItem = this.browserForm.value as Browsers;
    if (this.data.type === CommonConstants.MODAL_STATUS.NEW) {
      browserItem.id = 0;
      browserItem.createdAt = new Date();
      browserItem.createdBy = this.sharedService.getUserInfoFromLocalStorage().id;
      this.createItemModel(
        'Browsers',
        browserItem,
        () => {
          this.success(
            this.successAlertObj.createTitle,
            `${this.successAlertObj.text1} ${browserItem.name} ${this.successAlertObj.text2}`,
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
            `${this.errorAlertObj.text} ${browserItem.name}`,
            this.alertService,
            () => {},
          );
        },
        this.sharedService,
      );
    } else if (this.data.type === CommonConstants.MODAL_STATUS.UPDATE) {
      browserItem.id = this.data.model.id;
      browserItem.updatedAt = new Date();
      browserItem.updatedBy = this.sharedService.getUserInfoFromLocalStorage().id;
      browserItem.createdAt = this.data.createdAt;
      browserItem.createdBy = this.data.createdBy;
      this.updateItemModel(
        'Browsers',
        browserItem,
        () => {
          this.success(
            this.successAlertObj.updateTitle,
            `${this.successAlertObj.text1} ${browserItem.name} ${this.successAlertObj.text2}`,
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
            `${this.errorAlertObj.text} ${browserItem.name}`,
            this.alertService,
            () => {},
          );
        },
        this.sharedService,
      );
    }
  }
}

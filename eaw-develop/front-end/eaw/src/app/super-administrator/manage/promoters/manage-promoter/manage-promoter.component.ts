import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {GenericModal} from '../../../../shared/abstract-classes/modals/generic-modal.abstract';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {PromotersPageConstants} from '../promoters.constants';
import {Promoter} from 'src/app/models/promoter.model';
import {AlertService} from '../../../../utils/alerts/alerts.service';
import {SharedService} from '../../../../shared/shared.service';
import {CommonConstants} from '../../../../common/common.constants';

@Component({
  selector: 'app-manage-promoter',
  templateUrl: './manage-promoter.component.html',
  styleUrls: ['./manage-promoter.component.scss'],
  providers: [PromotersPageConstants, AlertService],
})

/**
 * Class component to manage promoters
 * Extends GenericModal to reuse shared functions
 */
export class ManagePromoterComponent extends GenericModal implements OnInit {
  public promoterForm: FormGroup;
  public formOptions: any;
  public listSexOrientations: any;
  public langIANA: string;
  public errorAlertObj: any;
  public successAlertObj: any;
  public translatePath: string;

  /**
   * Constructor component
   * @param dialogRef
   * @param formBuilder
   * @param sharedService
   * @param alertService
   */
  constructor(
    public dialogRef: MatDialogRef<ManagePromoterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private sharedService: SharedService,
    private translateCacheService: TranslateCacheService,
    private translate: TranslateService,
  ) {
    super();
    this.errorAlertObj = {};
    this.successAlertObj = {};
    this.translatePath = 'superAdministrator.manage.alerts.promoter';
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.setSexOrientationList(this.langIANA === 'es');
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.setSexOrientationList(this.langIANA === 'es');
    });
    this.formOptions = PromotersPageConstants.FORM_MANAGE_PROMOTER_OPTIONS;
    this.promoterForm = this.formBuilder.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputFirstName),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputLastName),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(this.formOptions.lengthInputEmail),
      ]),
      telephone: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputTelephone),
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputTelephone),
      ]),
      sex: new FormControl(0, [Validators.required]),
      password: new FormControl({value: '12345', disabled: true}, [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputPassword),
      ]),
      isActive: new FormControl('1', [Validators.required]),
    });
    this.loadForm();
  }

  ngOnInit() {
    this.getTranslationsAlerts();
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
      this.promoterForm.patchValue(this.data.model);
      this.loadRadioButtons();
    }
  }

  /**
   * Load radio button in the form
   */
  private loadRadioButtons() {
    this.promoterForm.controls.isActive.setValue(
      this.data.model.isActive.toString(),
    );
  }

  /**
   * List of the orientation sex
   */
  private setSexOrientationList(isSpanish: boolean): void {
    this.listSexOrientations = [
      {
        id: CommonConstants.SEX_ORIENTATIONS.male,
        text: isSpanish ? 'Masculino' : 'Male',
      },
      {
        id: CommonConstants.SEX_ORIENTATIONS.female,
        text: isSpanish ? 'Femenino' : 'Female',
      },
      {
        id: CommonConstants.SEX_ORIENTATIONS.undefined,
        text: isSpanish ? 'Indefinido' : 'Undefined',
      },
    ];
  }

  /**
   * Cancel event
   */
  public cancel(): void {
    this.data.cancelFn();
    this.dialogRef.close();
  }

  /**
   * Confirm event create or update promoters
   */
  public confirmFunction(): void {
    const promoterItem = this.promoterForm.value as Promoter;
    if (this.data.type === CommonConstants.MODAL_STATUS.NEW) {
      promoterItem.id = 0;
      promoterItem.languagesId = 1;
      promoterItem.realm = '';
      promoterItem.roleTypesId = CommonConstants.roles.Promoter;
      promoterItem.emailVerified = false;
      promoterItem.isDeleted = false;
      promoterItem.emailVerified = true;
      promoterItem.verificationToken = '';
      promoterItem.createdAt = new Date();
      promoterItem.createdBy = this.sharedService.getUserInfoFromLocalStorage().id;
      promoterItem.username = promoterItem.email;
      promoterItem.password = '12345';
      this.createItemModel(
        'Users',
        promoterItem,
        () => {
          this.success(
            this.successAlertObj.createTitle,
            `${this.successAlertObj.text1} ${promoterItem.firstName} ${this.successAlertObj.text2}`,
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
            `${this.errorAlertObj.text} ${promoterItem.firstName}`,
            this.alertService,
            () => {},
          );
        },
        this.sharedService,
      );
    } else if (this.data.type === CommonConstants.MODAL_STATUS.UPDATE) {
      promoterItem.id = this.data.model.id;
      promoterItem.updatedAt = new Date();
      promoterItem.updatedBy = this.sharedService.getUserInfoFromLocalStorage().id;
      promoterItem.createdAt = this.data.model.createdAt;
      promoterItem.createdBy = this.data.model.createdBy;
      this.updateItemModel(
        'Users',
        promoterItem,
        () => {
          this.success(
            this.successAlertObj.updateTitle,
            `${this.successAlertObj.text1} ${promoterItem.firstName} ${this.successAlertObj.text2}`,
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
            `${this.errorAlertObj.text} ${promoterItem.firstName}`,
            this.alertService,
            () => {},
          );
        },
        this.sharedService,
      );
    }
  }
}

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {GenericModal} from '../../../../shared/abstract-classes/modals/generic-modal.abstract';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {EvaluatorConstants} from '../evaluator.constants';
import {Evaluator} from 'src/app/models/evaluators.model';
import {AlertService} from '../../../../utils/alerts/alerts.service';
import {SharedService} from '../../../../shared/shared.service';
import {CommonConstants} from '../../../../common/common.constants';
import {Disabilities} from '../../../../models/disabilities.model';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-manage-evaluator',
  templateUrl: './manage-evaluator.component.html',
  styleUrls: ['./manage-evaluator.component.scss'],
  providers: [EvaluatorConstants, AlertService],
})
/**
 * Class component to manage evaluator
 */
export class ManageEvaluatorComponent extends GenericModal
  implements OnDestroy, OnInit {
  protected onDestroy = new Subject<void>();
  public evaluatorForm: FormGroup;
  public formOptions: any;
  public listDisabilities: Disabilities[];
  public listSexOrientations: any;
  public langIANA: string;
  public errorAlertObj: any;
  public successAlertObj: any;
  public translatePath: string;

  /**
   * Constructor method
   * @param dialogRef
   * @param data
   * @param formBuilder
   * @param alertService
   * @param sharedService
   * @param translateCacheService
   * @param translate
   */
  constructor(
    public dialogRef: MatDialogRef<ManageEvaluatorComponent>,
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
    this.translatePath = 'superAdministrator.manage.alerts.evaluator';
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.setSexOrientationList(this.langIANA === 'es');
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.setSexOrientationList(this.langIANA === 'es');
    });
    this.formOptions = EvaluatorConstants.FORM_MANAGE_PROMOTER_OPTIONS;
    this.evaluatorForm = this.formBuilder.group({
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
      disabilities: new FormControl([], [Validators.required]),
      isActive: new FormControl('1', [Validators.required]),
    });
    this.getAllActiveDisabilities();
    this.loadForm();
  }
  ngOnInit() {
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
      this.evaluatorForm.patchValue(this.data.model);
      this.loadRadioButtons();
      this.loadMultiSelect();
    }
  }

  /**
   * Load radio button in the form
   */
  private loadRadioButtons() {
    this.evaluatorForm.controls.isActive.setValue(
      this.data.model.isActive.toString(),
    );
  }

  /**
   * Load the disabilities to update the evaluator
   */
  private loadMultiSelect(): void {
    const disabilitiesId = [];
    this.data.model.disabilities.map(disability => {
      disabilitiesId.push(disability.id);
    });
    this.evaluatorForm.controls.disabilities.setValue(disabilitiesId);
  }

  /**
   * Get all actives disabilities for the multi select
   */
  getAllActiveDisabilities(): void {
    this.sharedService
      .getModelListByStatus<Disabilities>('Disabilities', 1)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listDisabilities = data;
      });
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
   * Confirm event create or update evaluators
   */
  public confirmFunction(): void {
    const evaluatorItem = this.evaluatorForm.value as Evaluator;
    if (this.data.type === CommonConstants.MODAL_STATUS.NEW) {
      evaluatorItem.id = 0;
      evaluatorItem.languagesId = 1;
      evaluatorItem.realm = '';
      evaluatorItem.roleTypesId = CommonConstants.roles.Evaluator;
      evaluatorItem.emailVerified = false;
      evaluatorItem.isDeleted = false;
      evaluatorItem.emailVerified = true;
      evaluatorItem.verificationToken = '';
      evaluatorItem.createdAt = new Date();
      evaluatorItem.createdBy = this.sharedService.getUserInfoFromLocalStorage().id;
      evaluatorItem.username = evaluatorItem.email;
      evaluatorItem.password = '12345';
      this.createItemModel(
        'Users/evaluators',
        {newEvaluator: evaluatorItem},
        () => {
          this.success(
            this.successAlertObj.createTitle,
            `${this.successAlertObj.text1} ${evaluatorItem.firstName} ${this.successAlertObj.text2}`,
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
            `${this.errorAlertObj.text} ${evaluatorItem.firstName}`,
            this.alertService,
            () => {},
          );
        },
        this.sharedService,
      );
    } else if (this.data.type === CommonConstants.MODAL_STATUS.UPDATE) {
      evaluatorItem.id = this.data.model.id;
      evaluatorItem.updatedAt = new Date();
      evaluatorItem.updatedBy = this.sharedService.getUserInfoFromLocalStorage().id;
      evaluatorItem.createdAt = this.data.model.createdAt;
      evaluatorItem.createdBy = this.data.model.createdBy;
      this.createItemModel(
        'Users/update-evaluator',
        {evaluatorToUpdate: evaluatorItem},

        () => {
          this.success(
            this.successAlertObj.updateTitle,
            `${this.successAlertObj.text1} ${evaluatorItem.firstName} ${this.successAlertObj.text2}`,
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
            `${this.errorAlertObj.text} ${evaluatorItem.firstName}`,
            this.alertService,
            () => {},
          );
        },
        this.sharedService,
      );
    }
  }
}

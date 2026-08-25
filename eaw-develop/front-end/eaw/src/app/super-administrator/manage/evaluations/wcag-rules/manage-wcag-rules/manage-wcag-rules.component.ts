import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

import {GenericModal} from '../../../../../shared/abstract-classes/modals/generic-modal.abstract';
import {WcagRulesConstants} from '../wcag-rules.constants';
import {Criterions} from '../../../../../models/criterions.model';
import {Principles} from '../../../../../models/principles.model';
import {GuideLine} from '../../../../../models/guideLine.model';
import {AlertService} from '../../../../../utils/alerts/alerts.service';
import {SharedService} from '../../../../../shared/shared.service';
import {CommonConstants} from '../../../../../common/common.constants';
import {Disabilities} from '../../../../../models/disabilities.model';
import {WcagRulesService} from '../wcag-rules.service';

@Component({
  selector: 'app-manage-wcag-rules',
  templateUrl: './manage-wcag-rules.component.html',
  styleUrls: ['./manage-wcag-rules.component.scss'],
  providers: [WcagRulesConstants, AlertService, WcagRulesService],
})

/**
 * Class component to manage criterions
 * Extends GenericModal to reuse shared functions
 */
export class ManageWcagRulesComponent extends GenericModal
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public criterionForm: FormGroup;
  public formOptions: any;
  public listDisabilities: Disabilities[];
  public listPrinciples: Principles[];
  public listGuideLines: GuideLine[];
  public errorAlertObj: any;
  public successAlertObj: any;
  public translatePath: string;

  constructor(
    public dialogRef: MatDialogRef<ManageWcagRulesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private sharedService: SharedService,
    private wcagRulesService: WcagRulesService,
    private translate: TranslateService,
  ) {
    super();
    this.errorAlertObj = {};
    this.successAlertObj = {};
    this.translatePath = 'superAdministrator.manage.alerts.wcagRule';
    this.formOptions = WcagRulesConstants.FORM_MANAGE_WCAGRULE_OPTIONS;
    this.criterionForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputName),
      ]),
      numberCriterion: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputNumberCriterion),
      ]),
      referenceLink: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputReferenceLink),
      ]),
      criterionDescription: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputCriterionDescription),
      ]),
      level: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputLevel),
      ]),
      principleId: new FormControl(0),
      guidelinesId: new FormControl(0, [Validators.required]),
      isActive: new FormControl('1', [Validators.required]),
      disabilities: new FormControl([], [Validators.required]),
    });
    this.loadForm();
    this.listGuideLines = [];
  }

  ngOnInit() {
    this.getAllActiveDisabilities();
    this.getAllPrinciples();
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
      this.criterionForm.patchValue(this.data.model);
      this.loadRadioButtons();
      this.loadMultiSelect();
      this.loadGuideLines(this.data.model.principle.id);
      this.criterionForm.controls.principleId.setValue(
        this.data.model.principle.id,
      );
    }
  }

  /**
   * Load radio button in the form
   */
  private loadRadioButtons(): void {
    this.criterionForm.controls.isActive.setValue(
      this.data.model.isActive.toString(),
    );
  }

  /**
   * Load the disabilities to update criterions
   */
  private loadMultiSelect(): void {
    const disabilitiesId = [];
    this.data.model.disabilities.map(disability => {
      disabilitiesId.push(disability.id);
    });
    this.criterionForm.controls.disabilities.setValue(disabilitiesId);
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
   * Get all principles for the select of principles
   */
  getAllPrinciples(): void {
    this.sharedService
      .getModelListByStatus<Principles>('Principles', null)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listPrinciples = data;
      });
  }

  /**
   * Load the guide lines since the principle selected
   * @param event
   */
  changePrinciple(event: any): void {
    this.loadGuideLines(event.value);
  }

  /**
   * Function to load all pattern of a principle
   * @param principleId the principle Id
   */
  loadGuideLines(principleId: number): void {
    this.wcagRulesService
      .getGuideByPrinciple<any>(principleId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listGuideLines = data.results;
      });
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
    const criterionItem = this.criterionForm.value as Criterions;
    if (this.data.type === CommonConstants.MODAL_STATUS.NEW) {
      criterionItem.id = 0;
      criterionItem.createdAt = new Date();
      criterionItem.createdBy = this.sharedService.getUserInfoFromLocalStorage().id;
      this.createItemModel(
        'Criterions/post-criterion',
        {newCriterion: criterionItem},
        () => {
          this.success(
            this.successAlertObj.createTitle,
            `${this.successAlertObj.text1} ${criterionItem.name} ${this.successAlertObj.text2}`,
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
            `${this.errorAlertObj.text} ${criterionItem.name}`,
            this.alertService,
            () => {},
          );
        },
        this.sharedService,
      );
    } else if (this.data.type === CommonConstants.MODAL_STATUS.UPDATE) {
      criterionItem.id = this.data.model.id;
      criterionItem.updatedAt = new Date();
      criterionItem.updatedBy = this.sharedService.getUserInfoFromLocalStorage().id;
      criterionItem.createdAt = this.data.createdAt;
      criterionItem.createdBy = this.data.createdBy;
      this.createItemModel(
        'Criterions/update-criterion',
        {criterionToUpdate: criterionItem},
        () => {
          this.success(
            this.successAlertObj.updateTitle,
            `${this.successAlertObj.text1} ${criterionItem.name} ${this.successAlertObj.text2}`,
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
            `${this.errorAlertObj.text} ${criterionItem.name}`,
            this.alertService,
            () => {},
          );
        },
        this.sharedService,
      );
    }
  }
}

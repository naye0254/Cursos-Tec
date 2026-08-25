import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

import {GenericModal} from '../../../../../shared/abstract-classes/modals/generic-modal.abstract';
import {SupportToolsConstants} from '../support-tools.constants';
import {SupportToolsService} from '../support-tools.service';
import {SupportTools} from '../../../../../models/supportTools.model';
import {AlertService} from '../../../../../utils/alerts/alerts.service';
import {SharedService} from '../../../../../shared/shared.service';
import {CommonConstants} from '../../../../../common/common.constants';
import {Disabilities} from '../../../../../models/disabilities.model';

@Component({
  selector: 'app-manage-support-tools',
  templateUrl: './manage-support-tools.component.html',
  styleUrls: ['./manage-support-tools.component.scss'],
  providers: [SupportToolsConstants, AlertService, SupportToolsService],
})

/**
 * Class component to manage support tools
 * Extends GenericModal to reuse shared functions
 */
export class ManageSupportToolsComponent extends GenericModal
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public supportToolsForm: FormGroup;
  public formOptions: any;
  public listDisabilities: any;
  public errorAlertObj: any;
  public successAlertObj: any;
  public translatePath: string;

  constructor(
    public dialogRef: MatDialogRef<ManageSupportToolsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private sharedService: SharedService,
    private supportToolsService: SupportToolsService,
    private translate: TranslateService,
  ) {
    super();
    this.errorAlertObj = {};
    this.successAlertObj = {};
    this.translatePath = 'superAdministrator.manage.alerts.supportTools';
    this.formOptions = SupportToolsConstants.FORM_MANAGE_SUPPORT_TOOLS_OPTIONS;
    this.supportToolsForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthName),
      ]),
      version: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthVersion),
      ]),
      isActive: new FormControl('1', [Validators.required]),
      disabilities: new FormControl([], [Validators.required]),
    });
    this.loadForm();
    this.listDisabilities = [];
  }

  ngOnInit() {
    this.getAllActiveDisabilities();
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
      this.supportToolsForm.patchValue(this.data.model);
      this.loadRadioButtons();
      this.loadMultiSelect();
    }
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
   * Load the disabilities to update support tool
   */
  private loadMultiSelect(): void {
    const disabilitiesId = [];
    this.data.model.disabilities.map(disability => {
      disabilitiesId.push(disability.id);
    });
    this.supportToolsForm.controls.disabilities.setValue(disabilitiesId);
  }

  /**
   * Load radio button in the form
   */
  private loadRadioButtons(): void {
    this.supportToolsForm.controls.isActive.setValue(
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
    const supportToolItem = this.supportToolsForm.value as SupportTools;
    if (this.data.type === CommonConstants.MODAL_STATUS.NEW) {
      supportToolItem.id = 0;
      supportToolItem.createdAt = new Date();
      supportToolItem.createdBy = this.sharedService.getUserInfoFromLocalStorage().id;
      this.createItemModel(
        'SupportTools/post-support-tool',
        {newSupportTool: supportToolItem},
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
      supportToolItem.createdAt = this.data.model.createdAt;
      supportToolItem.createdBy = this.data.model.createdBy;
      this.createItemModel(
        'SupportTools/update-support-tool',
        {supportToolToUpdate: supportToolItem},
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

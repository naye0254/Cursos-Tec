import {Component, OnInit, OnDestroy} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {SharedService} from '../../../../shared/shared.service';
import {Devices} from '../../../../models/devices.model';
import {OperativeSystems} from '../../../../models/operativeSystems.model';
import {Browsers} from '../../../../models/browsers.model';
import {SupportTools} from '../../../../models/supportTools.model';
import {NewEvaluationService} from '../new-evaluation.service';
import {AlertService} from '../../../../utils/alerts/alerts.service';
import {NewEvaluationsConstants} from '../new-evaluation.constants';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
  providers: [NewEvaluationService],
})
export class Step2Component implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public listDevices: Devices[];
  public listOperativeSystems: OperativeSystems[];
  public listBrowsers: Browsers[];
  public listSupportTools: SupportTools[];
  public listSpecification: any;
  public counterSpecification: number;
  public stepOneInformation: any;
  public userPromoterId: number;
  public hasStepOneProblems: boolean;
  public duplicateDataMessage: any;
  public invalidFormMessage: any;
  public langIANA: string;

  /*
 * Getting user from local storage to match the user type to use the
 * new evaluations shared module
  */
  private userDetail: any;

  constructor(
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private newEvaluationService: NewEvaluationService,
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translateCacheService: TranslateCacheService,
    private translate: TranslateService,
  ) {
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.duplicateDataMessage =
      NewEvaluationsConstants.ERROR_DUPLICATE_DATA_STEP_TWO[this.langIANA];
    this.invalidFormMessage =
      NewEvaluationsConstants.ERROR_INVALID_FORMS_STEP_TWO[this.langIANA];
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.duplicateDataMessage =
        NewEvaluationsConstants.ERROR_DUPLICATE_DATA_STEP_TWO[this.langIANA];
      this.invalidFormMessage =
        NewEvaluationsConstants.ERROR_INVALID_FORMS_STEP_TWO[this.langIANA];
    });
    this.listDevices = [];
    this.listOperativeSystems = [];
    this.listBrowsers = [];
    this.listSupportTools = [];
    this.listSpecification = [];
    this.counterSpecification = 1;
    this.userPromoterId = 0;
    this.hasStepOneProblems = false;
  }

  ngOnInit() {
    this.loadInformation();
    this.userPromoterId = JSON.parse(
      this.sharedService.getItemFromLocalStorage('userDetail'),
    ).id;
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Load information to the selected
   */
  loadInformation(): void {
    this.getAllActiveDevices();
    this.getAllActiveOperativeSystems();
    this.getAllActiveBrowsers();
    this.getAllActiveSupportTools();
    this.loadInformationStorage();
  }

  /**
   * Load the information of the storage
   */
  loadInformationStorage(): void {
    this.stepOneInformation = JSON.parse(
      this.sharedService.getItemFromLocalStorage('createEvaluationOne'),
    );
    if (this.stepOneInformation.disabilities.length === 0) {
      this.hasStepOneProblems = true;
    } else {
      this.stepOneInformation.disabilities.map(specification => {
        specification.countSpecification = this.counterSpecification;
        this.buildSpecificationObject(specification);
      });
    }
  }

  /**
   * Build a object to specification incluiding the form
   * @param specification
   */
  buildSpecificationObject(specification: any): any {
    const newSpecification = {
      countSpecification: this.counterSpecification,
      disabilityModel: specification.disabilityModel,
      evaluatorModel: specification.evaluatorModel,
      specificationForm: this.formBuilder.group({
        deviceId: new FormControl(null, [Validators.required]),
        operativeSystemId: new FormControl(null, [Validators.required]),
        browserId: new FormControl(null, [Validators.required]),
        supportToolId: new FormControl(null, [Validators.required]),
      }),
    };
    this.listSpecification.push(newSpecification);
    this.counterSpecification++;
    return newSpecification;
  }

  /**
   * Get all actives devices
   */
  getAllActiveDevices(): void {
    this.sharedService
      .getModelListByStatus<Devices>('Devices', 1)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listDevices = data;
      });
  }

  /**
   * Get all actives operative systems
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
   * Get all actives operative Browsers
   */
  getAllActiveBrowsers(): void {
    this.sharedService
      .getModelListByStatus<Browsers>('Browsers', 1)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listBrowsers = data;
      });
  }

  /**
   * Get all actives support tools
   */
  getAllActiveSupportTools(): void {
    this.sharedService
      .getModelListByStatus<SupportTools>('SupportTools', 1)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listSupportTools = data;
      });
  }

  /**
   * Function to call the service to register
   */
  registerEvaluation(): void {
    this.userDetail = JSON.parse(
      this.sharedService.getItemFromLocalStorage('userDetail'),
    );

    if (!this.checkIfAreDuplicateSpecifications()) {
      if (!this.checkIfAreInValidForms()) {
        this.stepOneInformation.generalInformation.createdBy = this.userPromoterId;
        this.newEvaluationService
          .postEvaluations<any>({
            generalInformation: this.stepOneInformation.generalInformation,
            sitesToEvaluate: this.stepOneInformation.sitesToEvaluate,
            specifications: this.buildSpecification(),
          })
          .pipe(takeUntil(this.onDestroy))
          .subscribe(data => {
            this.sharedService.deleteItemFromLocalStorage(
              'createEvaluationOne',
            );

            if (this.userDetail.roleTypesId === 2) // if user is admin
            {
              this.router.navigate(
                ['/administrator/evaluations/list-evaluations'],
                {
                  relativeTo: this.activatedRoute.parent,
                },
              );
            }
            else if (this.userDetail.roleTypesId === 1) // if user is admin
            {
              this.router.navigate(
                ['/super-administrator/evaluations/list-evaluations'],
                {
                  relativeTo: this.activatedRoute.parent,
                },
              );
            }
            this.alertService.openAlert(
              'Operación exitosa',
              'Evaluación(es) creada(s) con éxito',
              'éxito',
              () => {},
            );
          });
      } else {
        this.alertService.openAlert(
          this.invalidFormMessage.title,
          this.invalidFormMessage.body,
          'error',
          () => {},
        );
      }
    } else {
      this.alertService.openAlert(
        this.duplicateDataMessage.title,
        this.duplicateDataMessage.body,
        'error',
        () => {},
      );
    }
  }

  /**
   * Build a list of specification
   */
  private buildSpecification(): any {
    const specificationList = [];
    let formValue = null;
    this.listSpecification.map(specification => {
      if (specification.specificationForm.valid) {
        formValue = specification.specificationForm.value;
        specificationList.push({
          browsersId: formValue.browserId,
          devicesId: formValue.deviceId,
          operativeSystemsId: formValue.operativeSystemId,
          supportToolsId: formValue.supportToolId,
          disabilitiesId: specification.disabilityModel.id,
          usersId: specification.evaluatorModel.id,
        });
      }
    });
    return specificationList;
  }

  /**
   * Check the array of specifications if are duplicate data
   */
  checkIfAreDuplicateSpecifications(): boolean {
    let conditionToReturn = false;
    let specificationInfo = null;
    const specificationsChecked = [];
    for (const specification of this.listSpecification) {
      specificationInfo = specification.specificationForm.value;
      if (
        specificationsChecked.find(
          specificationChecked =>
            specificationChecked.specificationForm.value.deviceId ===
              specificationInfo.deviceId &&
            specificationChecked.specificationForm.value.operativeSystemId ===
              specificationInfo.operativeSystemId &&
            specificationChecked.specificationForm.value.browserId ===
              specificationInfo.browserId &&
            specificationChecked.specificationForm.value.supportToolId ===
              specificationInfo.supportToolId &&
            specificationChecked.evaluatorModel.id ===
              specification.evaluatorModel.id &&
            specificationChecked.disabilityModel.id ===
              specification.disabilityModel.id,
        ) === undefined
      ) {
        specificationsChecked.push(specification);
      } else {
        conditionToReturn = true;
        break;
      }
    }
    return conditionToReturn;
  }

  /**
   * Check the array of specifications to find invalid forms
   */
  checkIfAreInValidForms(): boolean {
    let conditionToReturn = false;
    let specificationInfo = null;
    const specificationsChecked = [];
    for (const specification of this.listSpecification) {
      specificationInfo = specification.specificationForm.value;
      if (
        specificationInfo.deviceId === null ||
        specificationInfo.operativeSystemId === null ||
        specificationInfo.browserId === null ||
        specificationInfo.supportToolId === null
      ) {
        conditionToReturn = true;
        break;
      } else {
        specificationsChecked.push(specification);
      }
    }
    return conditionToReturn;
  }
}

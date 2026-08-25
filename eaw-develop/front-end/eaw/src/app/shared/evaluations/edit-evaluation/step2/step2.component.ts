import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { TranslateCacheService } from 'ngx-translate-cache';

import { SharedService } from '../../../../shared/shared.service';
import { Devices } from '../../../../models/devices.model';
import { OperativeSystems } from '../../../../models/operativeSystems.model';
import { Browsers } from '../../../../models/browsers.model';
import { SupportTools } from '../../../../models/supportTools.model';
import { EditEvaluationService } from '../edit-evaluation.service';
import { AlertService } from '../../../../utils/alerts/alerts.service';
import { EditEvaluationsConstants } from '../edit-evaluation.constants';
import { browser } from 'protractor';
import { InputModalService } from 'src/app/utils/input-modal/input-modal/input-modal.service';
import { ConfirmationModalService } from 'src/app/utils/confirmation-modal/confirmation-modal.service';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
  providers: [EditEvaluationService, InputModalService]
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
  public savedEvaluationSpecifications: any;
  public evaluationId: any;
  public activeDisabilities: any = [];
  public activeUsers: any = [];

  /*
   * Getting user from local storage to match the user type to use the
   * new evaluations shared module
   */
  private userDetail: any;

  constructor(
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private editEvaluationService: EditEvaluationService,
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translateCacheService: TranslateCacheService,
    private translate: TranslateService,
    private confirmationModalService: ConfirmationModalService,
    private inputModalService: InputModalService
  ) {
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.duplicateDataMessage =
      EditEvaluationsConstants.ERROR_DUPLICATE_DATA_STEP_TWO[this.langIANA];
    this.invalidFormMessage = EditEvaluationsConstants.ERROR_INVALID_FORMS_STEP_TWO[this.langIANA];
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.duplicateDataMessage =
        EditEvaluationsConstants.ERROR_DUPLICATE_DATA_STEP_TWO[this.langIANA];
      this.invalidFormMessage =
        EditEvaluationsConstants.ERROR_INVALID_FORMS_STEP_TWO[this.langIANA];
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

  /* ToDo ToDos

  Para evaluaciones:
  + En pendientes: Antes de que se Seleccione o Genere páginas, se puede editar
      Editar el editar paquete: Ver Specifications and SpecificationsByEvaluation y evaluators, etc...
      Se puede cambiar todo menos: id, code.
      Restart scraping in progress.

  + En progreso:
      Nombre del sitio, segmento, etiqueta, plazo de evaluacion, (talvez el cliente).

  + En finalizadas: (Antes de generar el informe).
      Nombre del sitio, segmento, etiqueta.

    Si se necesita borrar: Detener el scraping y luego 'borrar'
  */

  ngOnInit() {
    this.userDetail = JSON.parse(this.sharedService.getItemFromLocalStorage('userDetail'));
    this.loadInformation();
    this.userPromoterId = JSON.parse(this.sharedService.getItemFromLocalStorage('userDetail')).id;

    this.evaluationId = this.activatedRoute.snapshot.params.evaluationId; // Getting evaluation id from url

    // Getting evaluation specifications by its id, located in url
    this.editEvaluationService
      .getEvaluationSpecificationsById(this.evaluationId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.savedEvaluationSpecifications = data;
        console.log(this.savedEvaluationSpecifications);

        // Loading all disabilities from db if users was selected in step 1
        const tmpDisabilities = [];
        this.stepOneInformation = JSON.parse(
          this.sharedService.getItemFromLocalStorage('createEvaluationOne')
        );
        if (
          this.savedEvaluationSpecifications.length > this.stepOneInformation.disabilities.length
        ) {
          this.savedEvaluationSpecifications.map(savedSpec => {
            this.stepOneInformation.disabilities.map(specification => {
              if (
                savedSpec.usersId === specification.evaluatorModel.id &&
                savedSpec.disabilitiesId === specification.disabilityModel.id
              ) {
                tmpDisabilities.push(Object.create(specification));
              }
            });
          });

          this.stepOneInformation.disabilities = tmpDisabilities;
          this.stepOneInformation.disabilities.map(specification => {
            specification.countSpecification = this.counterSpecification;
            this.buildSpecificationObject(specification);
          });
        }

        // Order specifications by its id
        this.listSpecification = this.listSpecification.sort((a, b) =>
          0 - a.disabilityModel.id > b.disabilityModel.id ? 1 : -1
        );

        for (const specification of this.savedEvaluationSpecifications) {
          for (const specificationGroup of this.listSpecification) {
            if (
              specification.disabilitiesId === specificationGroup.disabilityModel.id &&
              specification.usersId === specificationGroup.evaluatorModel.id &&
              specificationGroup.specificationForm.value.deviceId === null &&
              specificationGroup.specificationForm.value.operativeSystemId === null &&
              specificationGroup.specificationForm.value.browserId === null &&
              specificationGroup.specificationForm.value.supportToolId === null
            ) {
              specificationGroup.specificationForm.setValue({
                deviceId: specification.devicesId,
                operativeSystemId: specification.operativeSystemsId,
                browserId: specification.browsersId,
                supportToolId: specification.supportToolsId
              });
              break;
            }
          }
        }
        this.checkIfAreInValidForms();
      });
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
      this.sharedService.getItemFromLocalStorage('createEvaluationOne')
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
        supportToolId: new FormControl(null, [Validators.required])
      })
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
    this.userDetail = JSON.parse(this.sharedService.getItemFromLocalStorage('userDetail'));

    // this function can not be used until the logic for edit get corrected.

    if (!this.checkIfAreDuplicateSpecifications()) {
      if (!this.checkIfAreInValidForms()) {
        this.stepOneInformation.generalInformation.createdBy = this.userPromoterId;
        // Deleting old evaluation to insert new one (avoid site mapping problems)
        this.confirmationModalService.openConfirmDialog(
          'Editar la evaluación',
          'Al presionar "Aceptar" se reiniciará la evaluación con el nuevo URL.',
          'Aceptar',
          'Cancelar',
          () => {
            this.editEvaluationService
              .deleteEvaluation(this.evaluationId, "Evaluation edition")
              .pipe(takeUntil(this.onDestroy))
              .subscribe(res => {
                this.editEvaluationService
                  .postEvaluations<any>({
                    generalInformation: this.stepOneInformation.generalInformation,
                    sitesToEvaluate: this.stepOneInformation.sitesToEvaluate,
                    specifications: this.buildSpecification()
                  })
                  .pipe(takeUntil(this.onDestroy))
                  .subscribe(data => {
                    this.sharedService.deleteItemFromLocalStorage('createEvaluationOne');

                    // if user is admin
                    if (this.userDetail.roleTypesId === 2) {
                      this.router.navigate(['/administrator/evaluations/list-evaluations'], {
                        relativeTo: this.activatedRoute.parent
                      });
                    } else if (this.userDetail.roleTypesId === 1) {
                      // if user is admin
                      this.router.navigate(['/super-administrator/evaluations/list-evaluations'], {
                        relativeTo: this.activatedRoute.parent
                      });
                    }

                    this.alertService.openAlert(
                      'Operación exitosa',
                      'Evaluación editada con éxito',
                      'éxito',
                      () => { }
                    );
                  });
              });
          },
          () => {

          });
      } else {
        this.alertService.openAlert(
          this.invalidFormMessage.title,
          this.invalidFormMessage.body,
          'error',
          () => { }
        );
      }
    } else {
      this.alertService.openAlert(
        this.duplicateDataMessage.title,
        this.duplicateDataMessage.body,
        'error',
        () => { }
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
          usersId: specification.evaluatorModel.id
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
            specificationChecked.specificationForm.value.deviceId === specificationInfo.deviceId &&
            specificationChecked.specificationForm.value.operativeSystemId ===
            specificationInfo.operativeSystemId &&
            specificationChecked.specificationForm.value.browserId ===
            specificationInfo.browserId &&
            specificationChecked.specificationForm.value.supportToolId ===
            specificationInfo.supportToolId &&
            specificationChecked.evaluatorModel.id === specification.evaluatorModel.id &&
            specificationChecked.disabilityModel.id === specification.disabilityModel.id
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

  /**
   * Delete a evaluation by its id and return to evaluation page
   */
  deleteEvaluation() {
    this.inputModalService.openConfirmDialog(
      'Eliminar la evaluación',
      'Al eliminar esta evaluación quedará deshabilitada y no aparecerá en ninguna lista.',
      'Borrar',
      'Cancelar',
      () => {
        this.editEvaluationService
          .deleteEvaluation(this.evaluationId, this.inputModalService.getDeleteJustification())
          .pipe(takeUntil(this.onDestroy))
          .subscribe(res => {
            this.sharedService.deleteItemFromLocalStorage('createEvaluationOne');
            // if user is admin
            if (this.userDetail.roleTypesId === 2) {
              this.router.navigate(['/administrator/evaluations/list-evaluations'], {
                relativeTo: this.activatedRoute.parent
              });
            } else if (this.userDetail.roleTypesId === 1) {
              // if user is admin
              this.router.navigate(['/super-administrator/evaluations/list-evaluations'], {
                relativeTo: this.activatedRoute.parent
              });
            }

            this.alertService.openAlert(
              'Operación exitosa',
              'Evaluación eliminada con éxito',
              'éxito',
              () => { }
            );
          });
      },
      () => {
        //do nothing
      },
    );
  }
}

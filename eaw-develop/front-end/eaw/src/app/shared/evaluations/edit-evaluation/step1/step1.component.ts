import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { TranslateCacheService } from 'ngx-translate-cache';
import { map, startWith } from 'rxjs/operators';
import * as XLSX from 'xlsx';

import { SharedService } from '../../../../shared/shared.service';
import { Disabilities } from '../../../../models/disabilities.model';
import { Packages } from '../../../../models/packages.model';
import { Tags } from '../../../../models/tags.model';
import { EditEvaluationService } from '../edit-evaluation.service';
import { CommonConstants } from '../../../../common/common.constants';
import { EditEvaluationsConstants } from '../edit-evaluation.constants';
import { AlertService } from '../../../../utils/alerts/alerts.service';
import { ConfirmationModalService } from '../../../../utils/confirmation-modal/confirmation-modal.service';
import { EvaluationService } from '../../../../evaluator/evaluations/evaluations.service';
import { Evaluations } from '../../../../models/evaluations.model';
import { DatePipe } from '@angular/common';
import { InputModalService } from 'src/app/utils/input-modal/input-modal/input-modal.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
  providers: [EditEvaluationsConstants, InputModalService]
})
export class Step1Component implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public listDisabilities: any;
  public listPackages: Packages[];
  public listTags: Tags[];
  public listClients: [];
  public listSegments: any[];
  public listSitesNames: string[];
  public generalInfoForm: FormGroup;
  public listOfSites: any;
  public storageInformation: any;
  public siteCount: number;
  public isAutomaticEvaluation: boolean;
  public langIANA: string;
  public titleBtnContinue: string;
  public userPromoterId: number;
  public isAllFormsValid: boolean;
  public duplicateDataMessage: any;
  public selectedInput: number;
  public isFileLoaded: boolean;
  public isLoading: boolean;
  public savedEvaluation: any; // Saved evaluation
  public savedEvaluationDates: any;
  public savedEvaluationSpecifications: any;
  public evaluationId: any;
  public siteIsChanged: boolean;
  public packageIsChanged: boolean;

  /*
   * Getting user from local storage to match the user type to use the
   * new evaluations shared module
   */
  private userDetail: any;

  constructor(
    private sharedService: SharedService,
    private translateCacheService: TranslateCacheService,
    private translate: TranslateService,
    private editEvaluationService: EditEvaluationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private confirmationModalService: ConfirmationModalService,
    private inputModalService: InputModalService
  ) {
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.duplicateDataMessage =
      EditEvaluationsConstants.ERROR_DUPLICATE_DATA_STEP_ONE[this.langIANA];
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.duplicateDataMessage =
        EditEvaluationsConstants.ERROR_DUPLICATE_DATA_STEP_ONE[this.langIANA];
    });
    this.listDisabilities = [];
    this.selectedInput = 1;
    this.isLoading = false;
    this.listPackages = [];
    this.listTags = [];
    this.listOfSites = [];
    this.listClients = [];
    this.listSegments = [];
    this.listSitesNames = [];
    this.siteCount = 0;
    this.buildAllForms();
    this.storageInformation = null;
    this.isAutomaticEvaluation = false;
    this.titleBtnContinue = EditEvaluationsConstants.BTN_CONTINUE_STEP_ONE(
      this.isAutomaticEvaluation
    )[this.langIANA];
    this.isAllFormsValid = false;
    this.isFileLoaded = false;
    // Saving evaluationId to local storage to query it in dashboard component
    localStorage.setItem('evaluationId', this.activatedRoute.snapshot.params.evaluationId);
  }

  /* ToDo

  Refactor all edition component to improve code.

  Para evaluaciones:
  + En pendientes: Antes de que se Seleccione o Genere páginas, se puede editar
      Editar el editar paquete: Ver Specifications and SpecificationsByEvaluation y evaluators, etc...
      Se puede cambiar todo menos: id, code.
      Restart scraping in progress.

  + En progreso:
      Nombre del sitio, segmento, etiqueta, plazo o expiración de evaluacion, (talvez el cliente).

  + En finalizadas: (Antes de generar el informe).
      Nombre del sitio, segmento, etiqueta.

    Si se necesita borrar: Detener el scraping y luego 'borrar'
  */

  ngOnInit() {
    this.userDetail = JSON.parse(this.sharedService.getItemFromLocalStorage('userDetail'));
    // Getting evaluation id from url
    this.evaluationId = this.activatedRoute.snapshot.params.evaluationId;
    this.loadInformation();
    this.loadStorageInformation();
    this.userPromoterId = JSON.parse(this.sharedService.getItemFromLocalStorage('userDetail')).id;
    // Getting evaluation by its id, located in url
    this.editEvaluationService
      .getEvaluationById(this.evaluationId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.savedEvaluation = data;
        // Setting up general info
        this.generalInfoForm.patchValue({
          clientId: this.savedEvaluation.clientsId,
          packageId: this.savedEvaluation.packagesId
        });
        this.getAllSegmentsByClient(this.savedEvaluation.clientsId);
        // Setting up site info
        this.listOfSites[0].siteForm.patchValue({
          name: this.savedEvaluation.siteName,
          link: this.savedEvaluation.mainUrl,
          segmentId: this.savedEvaluation.segmentsId,
          tagId: this.savedEvaluation.tagId
        });
        this.changePackage(this.savedEvaluation.packagesId, true);
        this.checkIfValidForms();
      });

    // Getting evaluation dates by its id, located in url
    this.editEvaluationService
      .getEvaluationDatesById(this.evaluationId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.savedEvaluationDates = data;
        this.generalInfoForm.patchValue({
          expirationDate: this.datePipe.transform(
            new Date(this.savedEvaluationDates[0].expirationDate),
            'yyyy-MM-dd'
          )
        });
        this.checkIfValidForms();
      });

    // Getting evaluation specifications by its id, located in url
    this.editEvaluationService
      .getEvaluationSpecificationsById(this.evaluationId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.savedEvaluationSpecifications = data;
        for (const specification of this.savedEvaluationSpecifications) {
          this.selectDisability(specification.disabilitiesId);
          for (const disability of this.listDisabilities) {
            if (disability.disabilityModel.id === specification.disabilitiesId) {
              disability.evaluatorSelected = specification.usersId;
            }
          }
        }
        this.checkIfValidForms();
      });
  }

  ngOnDestroy() {
    this.saveStepOne();
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Load the forms with storage info
   */
  private loadStorageInformation(): void {
    const dataStorage = this.sharedService.getItemFromLocalStorage('createEvaluationOne');
    if (dataStorage) {
      this.storageInformation = JSON.parse(dataStorage);
      this.generalInfoForm.patchValue(this.storageInformation.generalInformation);
      this.changePackage(this.storageInformation.generalInformation.packageId, true);
      this.getAllSegmentsByClient(this.storageInformation.generalInformation.clientId);
      this.listOfSites = [];
      this.siteCount = 0;
      this.storageInformation.sitesToEvaluate.map(site => {
        this.buildSiteForm(site);
      });
      this.checkIfValidForms();
    }
  }

  /**
   * Call the functions yo build all forms of step one
   */
  buildAllForms(): void {
    this.buildGeneraInfoForm();
    this.buildSiteForm();
    this.listOfSites.push();
  }

  /**
   * Build the form of general information. 'dontStartScraping' only is
   * used in manual evaluation, maybe make a better implentation later.
   */
  buildGeneraInfoForm(): void {
    this.generalInfoForm = this.formBuilder.group({
      clientId: new FormControl(0, [Validators.required]),
      packageId: new FormControl({ disbled: true }, [Validators.required]),
      expirationDate: new FormControl(new Date(), [Validators.required]),
      dontStartScraping: new FormControl(false)
    });
  }

  /**
   * Built a site form for listOfSites array
   */
  buildSiteForm(siteData: any = null, filterData = true): void {
    const siteBuild = {
      siteCount: this.siteCount,
      siteForm: this.formBuilder.group({
        name: new FormControl('', [Validators.required]),
        link: new FormControl('', [Validators.required]),
        segmentId: new FormControl(0, [Validators.required]),
        tagId: new FormControl(0, [Validators.required])
      }),
      filteredOptions: null
    };
    if (filterData) {
      siteBuild.filteredOptions = siteBuild.siteForm.get('name').valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    }
    if (siteData) {
      siteBuild.siteForm.patchValue(siteData);
    }
    this.listOfSites.push(siteBuild);
    this.siteCount++;
    this.checkIfValidForms();
  }

  /**
   * Delete a site to evaluate of listOfSites
   * @param siteId
   */
  deleteSiteToEvaluate(siteId: number): void {
    this.listOfSites = this.listOfSites.filter(site => site.siteCount !== siteId);
  }

  /**
   * Load all information necesary to register the step 1
   */
  loadInformation(): void {
    this.getAllActiveDisabilities();
    this.getAllActivePackages();
    this.getAllTags();
    this.getAllDirectClients();
    this.getAllSitesNames();
  }

  /**
   * Put as selected a disability, and get evaluator by disability
   * @param disabilityId
   */
  public selectDisability(disabilityId: number): void {
    this.editEvaluationService
      .getAllEvaluatorByDisability<any>(disabilityId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        const disabilitySelected = this.listDisabilities.find(
          disability => disability.disabilityModel.id === disabilityId
        );
        if (data.results.length > 0) {
          disabilitySelected.hasNotEvaluators = false;
          disabilitySelected.isSelected = !disabilitySelected.isSelected;
          disabilitySelected.evaluatorsOptions = data.results;
        } else {
          disabilitySelected.hasNotEvaluators = true;
        }
      });
  }

  /**
   * Load the segment of a client selected
   * @param clientChoosed
   */
  changeClient(clientChoosed: any): void {
    this.getAllSegmentsByClient(clientChoosed.value);
  }

  /**
   * Get all direct clients
   */
  getAllDirectClients(): void {
    this.editEvaluationService
      .getAllDirectClients<any>()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listClients = data;
      });
  }

  /**
   * Get all segment of a client
   * @param clientId
   */
  getAllSegmentsByClient(clientId: number): void {
    this.editEvaluationService
      .getAllSegmentsByClients<any>(clientId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listSegments = data.results;
      });
  }

  /**
   * Get all sites names
   */
  getAllSitesNames(): void {
    this.editEvaluationService
      .getAllSitesNames<any>()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listSitesNames = data.results;
      });
  }

  /**
   * Get all actives disability
   */
  getAllActiveDisabilities(): void {
    this.sharedService
      .getModelListByStatus<Disabilities>('Disabilities', 1)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        data.map(disability => {
          this.listDisabilities.push({
            disabilityModel: disability,
            isSelected: false,
            evaluatorSelected: null,
            evaluatorsOptions: [],
            hasNotEvaluators: false
          });
        });
      });
  }

  /**
   * Get all actives packages
   */
  getAllActivePackages(): void {
    this.sharedService
      .getModelListByStatus<Packages>('Packages', 1)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listPackages = data;
      });
  }

  /**
   * Get all actives tags
   */
  getAllTags(): void {
    this.sharedService
      .getModelListByStatus<Packages>('Tags', null)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listTags = data;
      });
  }

  /**
   * Save the information of Step One in local storage
   */
  saveStepOne(): void {
    if (!this.isAutomaticEvaluation) {
      this.sharedService.setItemToLocalStorage(
        'createEvaluationOne',
        JSON.stringify({
          generalInformation: this.generalInfoForm.value,
          disabilities: this.prepareDisabilities(),
          sitesToEvaluate: this.prepareSiteToEvaluate()
        })
      );
      const routePath = 'step-2/' + this.evaluationId;
      this.router.navigate([routePath], {
        relativeTo: this.activatedRoute.parent
      });
    }
  }

  /**
   * Check if automatic for register
   */
  continueRegistering(): void {
    if (!this.checkIfAreDuplicateSites()) {
      if (this.isAutomaticEvaluation) {
        this.registerEvaluation();
      } else {
        this.saveStepOne();
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
   * Return a list with the disabilities and evaluator assigned
   */
  private prepareDisabilities(): any {
    const returnList = [];
    this.listDisabilities.map(disability => {
      if (disability.isSelected && disability.evaluatorSelected !== null) {
        returnList.push({
          disabilityModel: disability.disabilityModel,
          evaluatorModel: disability.evaluatorsOptions.find(
            evaluator => evaluator.id === disability.evaluatorSelected
          )
        });
      }
    });
    return returnList;
  }

  /**
   * Return a list with all site to evaluate
   */
  private prepareSiteToEvaluate(): any {
    const returnList = [];
    this.listOfSites.map(site => {
      returnList.push(site.siteForm.value);
    });
    return returnList;
  }

  /**
   * Check the package to hide component
   * @param event
   * @param isFromStorage
   */
  changePackage(event: any, isFromStorage: boolean = false): void {
    const valueToCheck = isFromStorage ? event : event.value;
    if (
      valueToCheck === CommonConstants.PACKAGES.RAMDOM_AUTOMATIC ||
      valueToCheck === CommonConstants.PACKAGES.SPECIFIC_AUTOMATIC
    ) {
      this.editEvaluationService.setHideStepTwo(true);
      this.isAutomaticEvaluation = true;
      this.titleBtnContinue = EditEvaluationsConstants.BTN_CONTINUE_STEP_ONE(
        this.isAutomaticEvaluation
      )[this.langIANA];
    } else {
      this.editEvaluationService.setHideStepTwo(false);
      this.isAutomaticEvaluation = false;
      this.titleBtnContinue = EditEvaluationsConstants.BTN_CONTINUE_STEP_ONE(
        this.isAutomaticEvaluation
      )[this.langIANA];
    }
  }

  /**
   * Function to call the service to register
   */
  registerEvaluation(): void {
    this.userDetail = JSON.parse(this.sharedService.getItemFromLocalStorage('userDetail'));
    const stepOneInformation = this.generalInfoForm.value;
    stepOneInformation.createdBy = this.userPromoterId;
    const siteInfo = this.listOfSites[0].siteForm.value;
    if (this.siteIsChanged || this.packageIsChanged) {
      this.confirmationModalService.openConfirmDialog(
        'Editar la evaluación',
        'Al presionar "Aceptar" se reiniciará la evaluación debido a los cambios realizados',
        'Aceptar',
        'Cancelar',
        () => {
          //se editan los datos que se deben editar
          this.editEvaluationService
            .patchEvaluation(
              this.evaluationId,
              siteInfo.name,
              siteInfo.segmentId,
              siteInfo.tagId,
              stepOneInformation.clientId,
              stepOneInformation.expirationDate
            )
            .pipe(takeUntil(this.onDestroy))
            .subscribe(_res => {
              this.editEvaluationService
                .deleteEvaluation(this.evaluationId, "Evaluation edition")
                .pipe(takeUntil(this.onDestroy))
                .subscribe(res => {
                  this.editEvaluationService
                    .postEvaluations<any>({
                      generalInformation: stepOneInformation,
                      sitesToEvaluate: this.prepareSiteToEvaluate()
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
            });
        },
        () => { }
      );
    }
    else if (this.listOfSites[0].siteForm.valid) {
      this.confirmationModalService.openConfirmDialog(
        'Editar la evaluación',
        'Al presionar "Aceptar" se guardarán los datos ',
        'Aceptar',
        'Cancelar',
        () => {
          this.editEvaluationService
            .patchEvaluation(
              this.evaluationId,
              siteInfo.name,
              siteInfo.segmentId,
              siteInfo.tagId,
              stepOneInformation.clientId,
              stepOneInformation.expirationDate
            )
            .pipe(takeUntil(this.onDestroy))
            .subscribe(_res => {
              this.alertService.openAlert(
                'Operación exitosa',
                'Evaluación editada con éxito',
                'éxito',
                () => {
                  this.goBack();
                }
              );
            });
        },
        () => { }
      );
    } else {
      this.alertService.openAlert(
        'Formulario incompleto',
        'Hay un campo o campos que no son válidos en el formulario.',
        'error',
        () => { }
      );
    }

    // ToDo further changes or editions will be considered in future.

    // There are more considerations in case we want to delete or change an evaluation.
    // Para evaluaciones:
    //   + En pendientes: Antes de que se Seleccione o Genere páginas, se puede editar
    //     Al editar paquete: Ver Specifications and SpecificationsByEvaluation y evaluators, etc...
    //     Se puede cambiar todo menos: id, code.
    //     Si se cambia algo más que (Nombre del sitio, segmento, etiqueta y cliente o expirationDate ) -> Llamar restart scraping in progress.
    //   + En progreso:
    //     Nombre del sitio, segmento, etiqueta, plazo de evaluacion, (talvez el cliente).
    //   + En finalizadas: (Antes de generar el informe).
    //     Nombre del sitio, segmento, etiqueta.
    //     Si se necesita borrar: Detener el scraping y luego 'borrar'

    // Deleting old evaluation to insert new one (avoid site mapping problems)
  }

  /**
   * Function to go back to the list of evaluations. Just to get back without
   * save form changes.
   */
  public goBack() {
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
  }

  /**
   * Function to apply the filter
   * @param value
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listSitesNames.filter(option => option.toLowerCase().includes(filterValue));
  }

  /**
   * Check is All forms are valid
   */
  checkIfValidForms(): void {
    const isGeneralInfoFormValid = this.generalInfoForm.valid ? true : false;
    let sitesToEvaluate = false;
    this.listOfSites.map(site => {
      sitesToEvaluate = site.siteForm.valid ? true : false;
    });
    this.isAllFormsValid = isGeneralInfoFormValid && sitesToEvaluate ? true : false;
  }

  /**
   * Check the array of site if are duplicate data
   */
  checkIfAreDuplicateSites(): boolean {
    let conditionToReturn = false;
    let siteInfo = null;
    const sitesChecked = [];
    for (const site of this.listOfSites) {
      siteInfo = site.siteForm.value;
      if (
        sitesChecked.find(
          siteChecked => siteChecked.name === siteInfo.name || siteChecked.link === siteInfo.link
        ) === undefined
      ) {
        sitesChecked.push(siteInfo);
      } else {
        conditionToReturn = true;
        break;
      }
    }
    return conditionToReturn;
  }

  /**
   * Process excel file to add evaluations
   * @param files
   */
  public handleFiles(files: FileList) {
    if (files.length > 0) {
      this.isLoading = true;
      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(files[0]);
      reader.onload = (e: any) => {
        const binarystr: string = e.target.result;
        const workbook: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
        const sheetName: string = workbook.SheetNames[0];
        const workSheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

        let data = XLSX.utils.sheet_to_json(workSheet);
        data = data.slice(2, data.length);
        this.setDataFileToForm(data);
      };

      reader.onloadstart = (_e: any) => {
        this.isLoading = true;
      };

      reader.onloadend = (_e: any) => {
        this.isLoading = false;
      };
    }
  }

  /**
   * Reset values when type is changed
   * @param type
   */
  public changeValueInput(type) {
    if (type === 1) {
      this.listOfSites = [];
      this.buildSiteForm(null, false);
      this.isFileLoaded = false;
    } else {
      this.listOfSites = [];
    }
  }

  /**
   * Set data to form
   * @param data
   */
  private setDataFileToForm(data) {
    this.isFileLoaded = true;
    data.forEach(institution => {
      const evalutonSite = {
        name: institution.__EMPTY_1,
        link: institution.__EMPTY_5,
        segmentId: this.getElementId(institution.__EMPTY_2, this.listSegments),
        tagId: this.getElementId(institution.__EMPTY_3, this.listTags)
      };
      this.buildSiteForm(evalutonSite, false);
    });
  }

  /**
   * Get selected element
   * @param nameSelected
   * @param list
   */
  private getElementId(nameSelected: string, list) {
    const selectedItem = list.filter(x => x.name === nameSelected)[0];
    return selectedItem ? selectedItem.id : undefined;
  }

  /**
   * Delete a evaluation by its id and return to evaluation page
   */
  // This function only set the evaluation with 'isDeleted'
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
            this.alertService.openAlert(
              'Operación exitosa',
              'Evaluación eliminada con éxito',
              'éxito',
              () => {
                this.goBack();
              }
            );
          });
      },
      () => {
        //do nothing
      }
    );
  }

  //site changed, change flag to restart the evaluation
  public siteChanged() {
    this.siteIsChanged = true;
  }

  public packageChanged(){
    this.packageIsChanged = true;
  }
}

import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {map, startWith} from 'rxjs/operators';
import {Inject} from '@angular/core';
import * as XLSX from 'xlsx';

import {SharedService} from '../../../../shared/shared.service';
import {Disabilities} from '../../../../models/disabilities.model';
import {Packages} from '../../../../models/packages.model';
import {Tags} from '../../../../models/tags.model';
import {NewEvaluationService} from '../new-evaluation.service';
import {CommonConstants} from '../../../../common/common.constants';
import {NewEvaluationsConstants} from '../new-evaluation.constants';
import {AlertService} from '../../../../utils/alerts/alerts.service';
import {IAppConfig, APP_CONFIG} from '../../../../../app.config';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
  providers: [NewEvaluationsConstants],
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

  /*
   * Getting user from local storage to match the user type to use the
   * new evaluations shared module
   */
  private userDetail: any;

  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    private sharedService: SharedService,
    private translateCacheService: TranslateCacheService,
    private translate: TranslateService,
    private newEvaluationService: NewEvaluationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
  ) {
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.duplicateDataMessage =
      NewEvaluationsConstants.ERROR_DUPLICATE_DATA_STEP_ONE[this.langIANA];
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.duplicateDataMessage =
        NewEvaluationsConstants.ERROR_DUPLICATE_DATA_STEP_ONE[this.langIANA];
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
    this.titleBtnContinue = NewEvaluationsConstants.BTN_CONTINUE_STEP_ONE(
      this.isAutomaticEvaluation,
    )[this.langIANA];
    this.isAllFormsValid = false;
    this.isFileLoaded = false;
  }

  ngOnInit() {
    this.loadInformation();
    this.loadStorageInformation();
    this.userPromoterId = JSON.parse(
      this.sharedService.getItemFromLocalStorage('userDetail'),
    ).id;
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
    const dataStorage = this.sharedService.getItemFromLocalStorage(
      'createEvaluationOne',
    );
    if (dataStorage) {
      this.storageInformation = JSON.parse(dataStorage);
      this.generalInfoForm.patchValue(
        this.storageInformation.generalInformation,
      );
      this.changePackage(
        this.storageInformation.generalInformation.packageId,
        true,
      );
      this.getAllSegmentsByClient(
        this.storageInformation.generalInformation.clientId,
      );
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
      packageId: new FormControl(0, [Validators.required]),
      expirationDate: new FormControl(new Date(), [Validators.required]),
      dontStartScraping: new FormControl(false),
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
        tagId: new FormControl(0, [Validators.required]),
      }),
      filteredOptions: null,
    };
    if (filterData) {
      siteBuild.filteredOptions = siteBuild.siteForm
        .get('name')
        .valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value)),
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
    this.listOfSites = this.listOfSites.filter(
      site => site.siteCount !== siteId,
    );
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
  selectDisability(disabilityId: number): void {
    this.newEvaluationService
      .getAllEvaluatorByDisability<any>(disabilityId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        const disabilitySelected = this.listDisabilities.find(
          disability => disability.disabilityModel.id === disabilityId,
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
    this.newEvaluationService
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
    this.newEvaluationService
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
    this.newEvaluationService
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
            hasNotEvaluators: false,
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
          sitesToEvaluate: this.prepareSiteToEvaluate(),
        }),
      );
      this.router.navigate(['step-2'], {
        relativeTo: this.activatedRoute.parent,
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
        () => {},
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
            evaluator => evaluator.id === disability.evaluatorSelected,
          ),
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
   */
  changePackage(event: any, isFromStorage: boolean = false): void {
    const valueToCheck = isFromStorage ? event : event.value;
    if (
      valueToCheck === CommonConstants.PACKAGES.RAMDOM_AUTOMATIC ||
      valueToCheck === CommonConstants.PACKAGES.SPECIFIC_AUTOMATIC
    ) {
      this.newEvaluationService.setHideStepTwo(true);
      this.isAutomaticEvaluation = true;
      this.titleBtnContinue = NewEvaluationsConstants.BTN_CONTINUE_STEP_ONE(
        this.isAutomaticEvaluation,
      )[this.langIANA];
    } else {
      this.newEvaluationService.setHideStepTwo(false);
      this.isAutomaticEvaluation = false;
      this.titleBtnContinue = NewEvaluationsConstants.BTN_CONTINUE_STEP_ONE(
        this.isAutomaticEvaluation,
      )[this.langIANA];
    }
  }

  /**
   * Function to call the service to register
   */
  registerEvaluation(): void {
    this.userDetail = JSON.parse(
      this.sharedService.getItemFromLocalStorage('userDetail'),
    );
    const stepOneInformation = this.generalInfoForm.value;
    stepOneInformation.createdBy = this.userPromoterId;
    this.newEvaluationService
      .postEvaluations<any>({
        generalInformation: stepOneInformation,
        sitesToEvaluate: this.prepareSiteToEvaluate(),
      })
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.sharedService.deleteItemFromLocalStorage('createEvaluationOne');
        if (this.userDetail.roleTypesId === 2) {
          // if user is admin
          this.router.navigate(
            ['/administrator/evaluations/list-evaluations'],
            {
              relativeTo: this.activatedRoute.parent,
            },
          );
        } else if (this.userDetail.roleTypesId === 1) {
          // if user is admin
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
  }

  /**
   * Function to apply the filter
   * @param value
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listSitesNames.filter(option =>
      option.toLowerCase().includes(filterValue),
    );
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
    this.isAllFormsValid =
      isGeneralInfoFormValid && sitesToEvaluate ? true : false;
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
          siteChecked =>
            siteChecked.name === siteInfo.name ||
            siteChecked.link === siteInfo.link,
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
      setTimeout(() => {
        const reader: FileReader = new FileReader();
        reader.readAsBinaryString(files[0]);
        reader.onload = (e: any) => {
          const binarystr: string = e.target.result;
          const workbook: XLSX.WorkBook = XLSX.read(binarystr, {
            type: 'binary',
          });
          const sheetName: string = workbook.SheetNames[0];
          const workSheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

          let data = XLSX.utils.sheet_to_json(workSheet);
          this.setDataFileToForm(data);
        };

        reader.onloadstart = (e: any) => {
          this.isLoading = true;
        };

        reader.onprogress = (e: any) => {
          if (e.lengthComputable) {
            this.isLoading = true;
          }
        };

        reader.onloadend = (e: any) => {
          this.isLoading = false;
        };
      }, 100);
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
        name: institution.Nombre,
        link: institution.URL,
        segmentId: this.getElementId(institution.Segmento, this.listSegments),
        tagId: this.getElementId(institution.Etiqueta, this.listTags),
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
   * Download template excel
   */
  public async downloadExcelTemplate() {
    const url = `${this.config.API_ENDPOINT_EAW}containers/templates/download/Plantilla%20lista%20evaluaciones.xlsx`;
    window.open(url, '_blank');
  }
}

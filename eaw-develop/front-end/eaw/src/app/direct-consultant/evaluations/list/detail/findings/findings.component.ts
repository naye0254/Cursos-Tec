import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import {Subject} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormGroup, FormBuilder} from '@angular/forms';
import {PaginationInstance} from 'ngx-pagination';
import {takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router'
import {FindingsService} from './findings.service';
import {Evaluations} from '../../../../../models/evaluations.model';
import {SharedService} from '../../../../../shared/shared.service';
import {CommonConstants} from '../../../../../common/common.constants';
import {FindingsConstants} from './findings.constants';
import {CriteriaInfoService} from '../../../../../evaluator/manual-evaluation/modals/criteria-info/criteria-info.service';

@Component({
  selector: 'app-findings',
  templateUrl: './findings.component.html',
  styleUrls: ['./findings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [FindingsService, FindingsConstants, CriteriaInfoService],
})
/**
 * Findings component class
 */
export class FindingsComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  private disabilityRolSelected: number;
  private selectedPages: any;
  private criterionSelected: any;
  private guidelineSelected: any;
  public pagConfig: PaginationInstance

  public findingsForm: FormGroup;
  public pages: any;
  public pagesManual: any;
  public disabilityRoles: any;
  public findings: any;
  public answers: any;
  public manualInfo: any;
  public pageIndexAutomatic: number;
  public pageIndexManual: number;
  public filter: any;
  public nothingMessage: string;
  public automaticLoading: number;
  public manualLoading: number;
  public package: number;
  public selectedEvaluation: number;
  public evaluation: Evaluations;
  public selectedPlaceholderManualPage: string;
  public packages: any;
  public principlePage: number;
  public recomendationList: any[];
  public criterions: any[];
  public guidelines: any[];
  public translatePath = 'evaluator.manualEvaluation';

  @ViewChild('headingOne', {static: false}) headingOne: ElementRef;
  @ViewChild('headingTwo', {static: false}) headingTwo: ElementRef;

  /**
   * Constructor method
   * @param formBuilder
   * @param findingsResultsService
   * @param sharedService
   * @param spinner
   */
  constructor(
    private formBuilder: FormBuilder,
    private findingsResultsService: FindingsService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private criteriaInfoService: CriteriaInfoService,
    private router: Router
  ) {
    this.pagConfig = FindingsConstants.pagConfig;
    this.selectedEvaluation = FindingsConstants.EVALUATION_STATES.AUTOMATIC;
    this.principlePage = 1;
    this.pages = [];
    this.pagesManual = [];
    this.disabilityRoles = [];
    this.findings = [];
    this.answers = [];
    this.pageIndexAutomatic = 1;
    this.pageIndexManual = 1;
    this.nothingMessage = 'No hay datos, seleccione una página.';
    this.automaticLoading = 0;
    this.manualLoading = 0;
    this.manualInfo = {};
    this.selectedPlaceholderManualPage = '';
    this.package = 0;
    this.disabilityRolSelected = 0;
    this.packages = CommonConstants.PACKAGES;
    this.manualInfo.observation = `Comentario realizado por el evaluador manual donde indica hallazgos,
    consejos o puntos a considerar sobre partes específicas del sitio web`;
  }

  ngOnInit() {
    this.formConfiguration();
    this.getEvaluation();
    this.getPages();

    this.getRolesByEvaluation();
    this.getFormValues();
    this.getPackage();
    this.setSelectionPage();
    this.refreshData();
    this.getGuidelines();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Set initial view depending the evaluation packages
   */
  private setSelectionPage() {
    if (
      this.package === CommonConstants.PACKAGES.RANDOM_MANUAL ||
      this.package === CommonConstants.PACKAGES.SPECIFIC_MANUAL
    ) {
      this.selectedEvaluation = FindingsConstants.EVALUATION_STATES.MANUAL;
    }
  }

  /**
   * Initialize the form
   */
  private formConfiguration() {
    this.findingsForm = this.formBuilder.group({
      page: [''],
      disabilityRole: ['0'],
      criterions: [''],
      guidelines: [''],
    });
  }

  /**
   * Get the package of the evaluation
   */
  private getPackage() {
    this.package = this.evaluation.packagesId;
  }

  /**
   * Get the evaluation from local storage
   */
  private getEvaluation() {
    this.evaluation = JSON.parse(
      this.sharedService.getItemFromLocalStorage('evaluationDetail'),
    );
  }

  /**
   * Get pages by evaluation id
   */
  private getPages() {
    this.findingsResultsService
      .getAutomaticEvaluatorPagesByEvaluationId(this.evaluation.id)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(pages => {
        this.pages = pages.results;
      });
  }

  /**
   * Get pages when manaul evaluations was selected
   */
  private getFormValues() {
    this.findingsForm
      .get('disabilityRole')
      .valueChanges.subscribe(disabilityRole => {
        this.answers = [];
        if (disabilityRole === '0' || disabilityRole === null) {
          this.disabilityRolSelected = undefined;
        } else {
          this.disabilityRolSelected = +disabilityRole;
        }
        this.refreshData();
      });

    this.findingsForm.get('page').valueChanges.subscribe(page => {
      this.answers = [];
      if (page === '0') {
        this.selectedPages = this.pages;
      } else {
        this.selectedPages = this.pages.filter(x => x.id === +page);
      }

      this.refreshData();
    });

    this.findingsForm.get('criterions').valueChanges.subscribe(criterions => {
      if (criterions === '0') {
        this.criterionSelected = this.criterions;
      } else {
        this.criterionSelected = this.criterions.filter(
          x => x.id === +criterions,
        );
      }
      this.refreshData();
    });

    this.findingsForm.get('guidelines').valueChanges.subscribe(guidelines => {
      this.criterions = [];
      this.criterionSelected = undefined;
      if (guidelines === '0') {
        this.guidelineSelected = this.guidelines;
      } else {
        this.guidelineSelected = this.guidelines.filter(
          x => x.id === +guidelines,
        );
      }
      this.refreshData();
    });
  }

  /**
   * Get disability roles assigned to a evaluation
   */
  private getRolesByEvaluation() {
    this.findingsResultsService
      .getDisabilityByEvaluationId(this.evaluation.id)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(roles => {
        this.disabilityRoles = roles.results;
      });
  }

  /**
   * Function to change the values triggered by the paginator
   * @param number
   */
  public onPageChange(number: number) {
    this.pagConfig.currentPage = number;
    this.getFindings();
  }

  /**
   * Get findings from evalution and page
   */
  private getFindings() {
    const next =
      this.pagConfig.currentPage * this.pagConfig.itemsPerPage - this.pagConfig.itemsPerPage;

    this.spinner.show('spinnerAutomatic');
    this.automaticLoading = 1;
    this.findingsResultsService
      .getFindingsByAutomaticPage(
        this.evaluation.id,
        this.guidelineSelected,
        this.criterionSelected,
        this.selectedPages,
        this.pagConfig.itemsPerPage,
        next
      )
      .subscribe(data => {
        this.findings = data.results;
        this.pagConfig.totalItems = data.count;
        this.spinner.hide('spinnerAutomatic');
        this.automaticLoading = 0;
      });
  }

  /**
   * Get answers from evaluation and page
   */
  private getAnswers() {
    this.verifyDisabilityRoleSelected();
    this.spinner.show('spinnerManual');
    this.manualLoading = 1;

    this.findingsResultsService
      .getAnwersByManualPage(
        this.evaluation.id,
        this.disabilityRolSelected,
        this.principlePage,
        this.selectedPages,
      )
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        manualAnswers => {
          this.answers = manualAnswers.results;
          this.spinner.hide('spinnerManual');
          this.manualLoading = 0;
        },
        error => {
          this.answers = [];
          this.manualInfo = {};
          this.spinner.hide('spinnerManual');
          this.manualLoading = 0;
        },
      );
  }

  /**
   * Get manual observations by evaluation Id
   */
  private getObservations() {
    this.findingsResultsService
      .getObservationsByManualPage(
        this.evaluation.id,
        this.disabilityRolSelected,
        this.principlePage,
        this.selectedPages,
      )
      .subscribe(data => {
        this.recomendationList = data.results;
      });
  }

  /**
   * Verify if a role has been selected
   */
  private verifyDisabilityRoleSelected() {
    if (
      this.disabilityRolSelected === 0 ||
      this.disabilityRolSelected === null
    ) {
      this.disabilityRolSelected = undefined;
    }
  }

  /**
   * Refresh the data of the tables
   */
  private refreshData() {
    this.answers = [];
    this.recomendationList = [];
    if (
      this.selectedEvaluation === FindingsConstants.EVALUATION_STATES.MANUAL
    ) {
      this.getAnswers();
      this.getObservations();
    } else {
      this.getFindings();
    }
  }

  /**
   * Get principles
   */
  private getPrincipleData() {
    this.findingsResultsService
      .getPrincipleById(this.principlePage)
      .subscribe(data => {
        this.openInfoModal(data.id + '.', data.name, '', data.referenceLink);
      });
  }

  /**
   * Open the information criteria modal.
   * @param numberCriteria
   * @param title
   * @param text
   * @param link
   */
  private openInfoModal(numberCriteria, title, text, link) {
    this.criteriaInfoService.openDialog(
      '50%',
      numberCriteria,
      title,
      text,
      link,
      () => {},
    );
  }

  /**
   * Get guidelines
   */
  private getGuidelines() {
    this.findingsResultsService
      .getGuideByPrinciple(this.principlePage)
      .subscribe((data: any) => {
        this.guidelines = data.results;
        this.guidelineSelected = this.guidelines;
        this.refreshData();
      });
  }

  /**
   * Event to change manual or automatic evaluation
   * @param type
   */
  public changeEvaluationType(type: number) {
    this.selectedPages = undefined;
    this.selectedEvaluation = type;
  }

  /**
   * Change the data when a page is changed
   * @param pageSelected
   */
  public changePrinciplePage(pageSelected: number) {
    this.principlePage = pageSelected;
    this.criterions = [];
    this.criterionSelected = undefined;
    if (
      this.selectedEvaluation === FindingsConstants.EVALUATION_STATES.MANUAL
    ) {
      this.refreshData();
    } else {
      this.getGuidelines();
    }
  }

  /**
   * Update the principle selected when the paged is selected to behind
   */
  public changePrinciplePageBehind() {
    this.principlePage =
      this.principlePage > 1 ? this.principlePage - 1 : this.principlePage;
  }

  /**
   * Update the principle selected when the paged is selected to ahead
   */
  public changePrinciplePageAhead() {
    this.principlePage =
      this.principlePage < 4 ? this.principlePage + 1 : this.principlePage;
  }

  /**
   * Get the principal title depending to the evaluaton package
   */
  public getPrincipleTitle() {
    switch (this.principlePage) {
      case 1:
        return FindingsConstants.PRINCIPLE_TITLE.perceivable;
      case 2:
        return FindingsConstants.PRINCIPLE_TITLE.operable;
      case 3:
        return FindingsConstants.PRINCIPLE_TITLE.understandable;
      case 1:
        return FindingsConstants.PRINCIPLE_TITLE.robust;
    }
  }

  /**
   * Call to the modal to show the principle info
   */
  public openModalPrincipleInfo() {
    this.getPrincipleData();
  }

  /**
   * Open a modal to see the criteria info
   * @param answer
   */
  public openModalCriteriaInfo(answer) {
    this.openInfoModal(
      answer.criterionNumberCriterion,
      answer.criterionName,
      answer.criterionDescription,
      answer.criterionReferenceLink,
    );
  }

  /**
   * Get criterion by guideline selected
   * @param guidelinesId
   */
  public getCriterionsByGuideline(guidelinesId) {
    this.criterions = [];
    this.criterionSelected = undefined;
    this.findingsResultsService
      .getCriterionsByGuideline(+guidelinesId)
      .subscribe(data => {
        this.criterions = data;
      });
  }
}

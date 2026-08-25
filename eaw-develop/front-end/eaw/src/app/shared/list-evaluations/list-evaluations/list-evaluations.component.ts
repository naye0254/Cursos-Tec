import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  OnChanges,
  Output, 
  EventEmitter
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateCacheService } from 'ngx-translate-cache';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { EvaluationsConstants } from './list-evaluations.constants';
import { CommonConstants } from '../../../common/common.constants';
import { SharedService } from '../../shared.service';
import { GenericList } from '../../../shared/abstract-classes/list/list.abstract';
import { SuperAdministratorConstants } from '../../../super-administrator/super-administrator.constants';
import { SelectionPageService } from './selection-page/selection-page.service';
import { CheckpointService } from './checkpoint/checkpoint.service';
import { AlertService } from '../../../utils/alerts/alerts.service';

@Component({
  selector: 'app-list-evaluations',
  templateUrl: './list-evaluations.component.html',
  styleUrls: ['./list-evaluations.component.scss'],
  providers: [
    EvaluationsConstants,
    CommonConstants,
    SuperAdministratorConstants,
    SelectionPageService,
    CheckpointService
  ]
})
/**
 * Component to list evaluations
 * Extends the GenericList class to reuse shared functions
 */
export class ListEvaluationsComponent extends GenericList implements OnInit, OnDestroy, OnChanges {
  protected onDestroy = new Subject<void>();

  public searchFilter: string;
  public listEvaluations: any[];
  public displayedColumns: string[];
  public tableDataSource: any;
  public manageModalInformation: any;
  public isEmpty: boolean;
  public noResults: boolean;
  public langIANA: string;
  public sidebarSuperAdministratorOptions: any;
  public title: string;
  public userRole: number;
  public evaluatorRole: number;
  public promoterRole: number;
  public superAdministratorRole: number;
  public evaluationsStates: any;
  public reportStates: any;
  public scrapingStates: any;
  public emptyMessages: any;
  public packages: any;
  public paginationState: any;

  @Input() public evaluationState: number;
  @Output() public evaluationSelected: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  /**
   * Constructor of the component
   */
  constructor(
    private sharedService: SharedService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private selectionModalService: SelectionPageService,
    private checkpointService: CheckpointService,
    private router: Router,
    private alertService: AlertService
  ) {
    super();
    this.paginationState = this.sharedService.getPaginationState();
    this.evaluationState = this.sharedService.getEvaluationState();
    this.title = '';
    this.evaluationsStates = CommonConstants.EVALUATIONS_STATES;
    this.reportStates = CommonConstants.REPORT_STATES;
    this.packages = CommonConstants.PACKAGES;
    this.scrapingStates = CommonConstants.SCRAPING_STATES;
    this.evaluatorRole = CommonConstants.roles.Evaluator;
    this.promoterRole = CommonConstants.roles.Promoter;
    this.superAdministratorRole = CommonConstants.roles.SuperAdministrator;
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.emptyMessages = EvaluationsConstants.EMPTY_RESULTS[this.langIANA];
    this.setHTMLTitle(this.langIANA);
    this.sidebarSuperAdministratorOptions =
      SuperAdministratorConstants.SIDEBAR_SUPER_ADMINISTRATOR_LIST_EVALUATIONS_OPTIONS[
      this.langIANA
      ];

    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.sidebarSuperAdministratorOptions =
        SuperAdministratorConstants.SIDEBAR_SUPER_ADMINISTRATOR_LIST_EVALUATIONS_OPTIONS[
        event.lang
        ];
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.emptyMessages = EvaluationsConstants.EMPTY_RESULTS[event.lang];
      this.setHTMLTitle(this.langIANA);
    });

    this.resetVaribles();
    this.userRole = this.sharedService.getUserInfoFromLocalStorage().roleTypesId;
    this.evaluationSelected = new EventEmitter<any>();
    this.setValuesRol();
    this.getEvaluations();
  }

  ngOnInit() {
    if (this.paginationState.pageIndex >= 1) {
      this.paginationState.pageIndex -= 1;
    }
    this.paginator.pageIndex = this.paginationState.pageIndex;
  }

  ngOnDestroy() {
    this.sharedService.setPaginationState(this.paginationState);
    this.sharedService.setEvaluationState(this.evaluationState);
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  ngOnChanges() {
    this.setValuesRol();
  }

  /**
   * Set values related the role of the user
   */
  private setValuesRol() {
    if (this.verifyRole(CommonConstants.roles.Evaluator)) {
      this.title = EvaluationsConstants.STR_STATES_PLURAL[this.langIANA]()[this.evaluationState];
      this.displayedColumns = EvaluationsConstants.TABLE_COLUMS_EVALUATOR;
      //this.getEvaluations();
    } else if (this.verifyRole(CommonConstants.roles.Promoter)) {
      this.displayedColumns = EvaluationsConstants.TABLE_COLUMS_PROMOTER;
      this.title = EvaluationsConstants.HTML_TITLE[this.langIANA].title;
      this.evaluationState = this.sharedService.getEvaluationState();
      //this.getEvaluations();
    } else {
      this.displayedColumns = EvaluationsConstants.TABLE_COLUMS;
      this.title = EvaluationsConstants.HTML_TITLE[this.langIANA].title;
      this.evaluationState = this.sharedService.getEvaluationState();
      //this.getEvaluations();
    }
  }

  /**
   * Verify the user role with the role in local storage
   * @param role to verify
   */
  private verifyRole(role: number): boolean {
    return role === this.userRole;
  }

  /**
   * Change the HTML title
   * @param language string language
   */
  private setHTMLTitle(language: string) {
    this.sharedService.setTitle(EvaluationsConstants.HTML_TITLE[language].title);
  }

  /**
   * Reset variables
   */
  private resetVaribles() {
    this.isEmpty = false;
    this.noResults = false;
    this.searchFilter = '';
  }

  /**
   * Apply a filter, calls to super class
   * @param event filter by the evaluation
   */
  public applyFilter(event: Event): void {
    this.tableDataSource = super.applyFilter(event, this.tableDataSource);
    this.noResults = this.tableDataSource.filteredData.length === 0;
  }

  /**
   * Apply a filter by status
   * @param event filter by the segment
   */
  public applyStateFilter(event: any): void {
    this.resetVaribles();
    this.paginationState = {
      previousPageIndex: 0,
      pageIndex: 1,
      pageSize: 5,
      length: 0,
      itemsPerPage: 0,
      beginRange: 0,
      endRange: 0
    };   
    this.sharedService.setPaginationState(this.paginationState);
    this.paginator.pageIndex = 0;
    switch (event.index) {
      case CommonConstants.EVALUATIONS_STATES.PENDING:
        this.evaluationState = CommonConstants.EVALUATIONS_STATES.PENDING;
        this.getEvaluations();
        break;
      case CommonConstants.EVALUATIONS_STATES.PROGRESS:
        this.evaluationState = CommonConstants.EVALUATIONS_STATES.PROGRESS;
        this.getEvaluations();
        break;
      case CommonConstants.EVALUATIONS_STATES.FINISHED:
        this.evaluationState = CommonConstants.EVALUATIONS_STATES.FINISHED;
        this.getEvaluations();
        break;
      case 3:
        this.evaluationState = 3;
        this.getEvaluations();
        break;
      default:
        break;
    }
  }

  /**
   * List evaluations by role
   */
  public getEvaluations() {
    
    if (this.verifyRole(CommonConstants.roles.Evaluator)) {
      
      const userId = this.sharedService.getUserInfoFromLocalStorage().id;
      this.sharedService
        .getEvaluationsByEvaluatorAndState<any>(userId, this.evaluationState)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(data => {
          this.listEvaluations = this.setStatusLabel(data.results);
          this.isEmpty = this.listEvaluations.length === 0;
          this.tableDataSource = new MatTableDataSource<any>(this.listEvaluations);
          this.initTableLabels(this.paginator);
          this.tableDataSource.paginator = this.paginator;
          if (this.paginationState.pageIndex != 1) {
            this.setPaginationState(this.paginationState, null);
            this.paginator.pageIndex = this.paginationState.pageIndex;
          } else {
            this.setPaginationState(null, data.count);
          }
        });
    } else if (this.evaluationState == 3) {
      
      this.sharedService
      .getAllFailedEvaluations<any>()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listEvaluations = this.setStatusLabel(data.results);
        this.isEmpty = this.listEvaluations.length === 0;
        this.tableDataSource = new MatTableDataSource<any>(this.listEvaluations);
        this.initTableLabels(this.paginator);
        this.tableDataSource.paginator = this.paginator;
        if (this.paginationState.pageIndex != 1) {
          this.setPaginationState(this.paginationState, null);
        } else {
          this.setPaginationState(null, data.count);
        }
      });
    } else {
      
      this.sharedService
        .getAllEvaluations<any>(this.evaluationState)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(data => {
          this.listEvaluations = this.setStatusLabel(data.results);
          this.isEmpty = this.listEvaluations.length === 0;
          this.tableDataSource = new MatTableDataSource<any>(this.listEvaluations);
          this.initTableLabels(this.paginator);
          this.tableDataSource.paginator = this.paginator;
          if (this.paginationState.pageIndex != 1) {
            this.setPaginationState(this.paginationState, null);
          } else {
            this.setPaginationState(null, data.count);
          }
        });
    }
  }


  /**
   * Function to update page quantity from paginator
   * @param paginationState
   * @param count
   */
  public setPaginationState(paginationState, count?: number) {
    if (count) {
      this.paginationState = {
        previousPageIndex: 0,
        pageIndex: 1,
        pageSize: 5,
        length: 0,
        itemsPerPage: 0,
        beginRange: 0,
        endRange: 0
      };
      this.paginationState.length = count;
      this.paginationState.endRange =
        this.paginationState.pageSize > this.tableDataSource.filteredData.length
          ? this.tableDataSource.filteredData.length
          : this.paginationState.pageSize;
    }
    if (paginationState) {
      this.paginationState = paginationState;
      this.paginationState.beginRange =
        ++this.paginationState.pageIndex * this.paginationState.pageSize -
        this.paginationState.pageSize +
        1;
      this.paginationState.endRange =
        this.paginationState.beginRange + this.paginationState.pageSize - 1;
      if (this.paginationState.endRange > this.tableDataSource.filteredData.length) {
        this.paginationState.endRange = this.tableDataSource.filteredData.length;
      }
    }
  }

  /**
   * Emit an event when evaluation is selected
   * @param selectedEvaluation
   */
  sendEvaluationSelected(selectedEvaluation) {
    this.evaluationSelected.emit(selectedEvaluation);
  }

  /**
   * Open a modal with a list of specifications
   * @param evaluation
   */
  openSpecificationsModal(evaluation) {
    this.selectionModalService.openDialog(
      evaluation,
      () => { },
      () => { }
    );
  }

  /**
   * Open a modal with the checkpoint of the scraping.
   * @param evaluation
   */
  openCheckpointModal(evaluation) {
    this.checkpointService.openDialog('50%', evaluation, () => {
      this.getEvaluations();
    });
  }

  starEvaluation(idEvaluation, idPackage, element) {
    this.sharedService.postStartEvaluation(idEvaluation, idPackage).subscribe(
      data => {
        this.alertService.openAlert(
          'Iniciado',
          'La evaluación ha comenzado de forma correcta.',
          'éxito',
          () => {
            this.getEvaluations();
          }
        );
      },
      error => {
        this.alertService.openAlert(
          'Error al iniciar',
          'La evaluación no ha podido iniciarse de forma correcta.',
          'error',
          () => {
            this.getEvaluations();
          }
        );
      }
    );
  }

  generateRandomSelectedPages(element) {
    this.sharedService.getSaveRandomSelectedPages(element.id).subscribe(
      data => {
        this.alertService.openAlert(
          'Generado correctamente',
          'La generación de la selección de páginas de forma aleatoria se ha hecho correctamente.',
          'éxito',
          () => {
            this.starEvaluation(element.id, element.packagesId, element);
          }
        );
      },
      error => {
        this.alertService.openAlert(
          'Error al generar',
          'La generación de la selección de páginas no se ha podido hacer, por favor, vuelvalo a intentar.',
          'error',
          () => {
            this.getEvaluations();
          }
        );
      }
    );
  }

  generateReport(element) {
    this.sharedService.generateReports(element.id, element.evaluationCode).subscribe(
      data => {
        this.alertService.openAlert(
          'Generando reportes',
          'El reporte puede tardar varios minutos en ser generado.',
          'éxito',
          () => {
            this.getEvaluations();
          }
        );
      },
      error => {
        this.alertService.openAlert(
          'Error',
          'La generación de reportes no se ha podido hacer, por favor, contacte a soporte.',
          'error',
          () => {
            this.getEvaluations();
          }
        );
      }
    );
  }

  goResults(evaluationId) {
    this.router.navigateByUrl(
      `/administrator/evaluations/list-evaluations/detail/results/${evaluationId}/statistics/stats`
    );
  }

  /**
     * Function to show the error description of a failed/pending evaluation, its 
     * id is required
     * @param evaluationId
     */
  goErrorDescription(evaluationId){
    this.router.navigateByUrl(
      `/administrator/evaluations/list-evaluations/detail/error/${evaluationId}`
    );
  }

  /**
   * Function to navigate to the page to edit a evaluation, its
   * id is required
   * @param evaluationId
   */
  editEvaluation(evaluationId) {
    if (this.verifyRole(CommonConstants.roles.Promoter)) {
      this.router.navigateByUrl(
        `/administrator/evaluations/edit-evaluation/step-1/${evaluationId}`
      );
    } else if (this.verifyRole(CommonConstants.roles.SuperAdministrator)) {
      this.router.navigateByUrl(
        `/super-administrator/evaluations/edit-evaluation/step-1/${evaluationId}`
      );
    }
  }
}

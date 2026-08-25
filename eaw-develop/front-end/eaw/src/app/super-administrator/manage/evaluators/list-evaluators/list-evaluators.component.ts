import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {EvaluatorConstants} from '../evaluator.constants';
import {CommonConstants} from '../../../../common/common.constants';
import {ManageEvaluatorService} from '../manage-evaluator/manage-evaluator.service';
import {SharedService} from '../../../../shared/shared.service';
import {GenericList} from '../../../../shared/abstract-classes/list/list.abstract';
import {Evaluator} from '../../../../models/evaluators.model';
import {EvaluatorsService} from '../evaluators.service';

@Component({
  selector: 'app-list-evaluators',
  templateUrl: './list-evaluators.component.html',
  styleUrls: ['./list-evaluators.component.scss'],
  providers: [
    EvaluatorConstants,
    ManageEvaluatorService,
    CommonConstants,
    EvaluatorsService,
  ],
})
export class ListEvaluatorsComponent extends GenericList
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public searchFilter: string;
  public listEvaluators: Evaluator[] = [];
  public displayedColumns: string[];
  public tableDataSource: any;
  public manageModalInformation: any;
  public emptyMessages: any;
  public isEmpty: boolean;
  public noResults: boolean;
  public langIANA: string;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  /**
   * Constructor of the component
   * @param manageEvaluatorService
   * @param sharedService
   */
  constructor(
    private manageEvaluatorService: ManageEvaluatorService,
    private sharedService: SharedService,
    private evaluatorService: EvaluatorsService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    super();
    this.langIANA = translateCacheService.getCachedLanguage();
    this.emptyMessages =
      EvaluatorConstants.EMPTY_RESULTS[
        translateCacheService.getCachedLanguage()
      ];
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.emptyMessages = EvaluatorConstants.EMPTY_RESULTS[event.lang];
    });
    this.displayedColumns = EvaluatorConstants.TABLE_COLUMS;
    this.tableDataSource = new MatTableDataSource<Evaluator>(
      this.listEvaluators,
    );
    this.manageModalInformation = EvaluatorConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.resetVaribles();
  }

  ngOnInit() {
    this.getEvaluators(null);
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
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
   * Take a list of evaluators by the status
   * @param status if the evaluator is active
   */
  private getEvaluators(status) {
    this.evaluatorService.getAllEvaluators<any>(status).subscribe(data => {
      this.listEvaluators = this.setStatusLabel(data.results);
      this.listEvaluators = this.setTypeDisabilitiesLabels(data.results);
      this.isEmpty = this.listEvaluators.length === 0;
      this.displayedColumns = EvaluatorConstants.TABLE_COLUMS;
      this.tableDataSource = new MatTableDataSource<Evaluator>(
        this.listEvaluators,
      );
      this.initTableLabels(this.paginator);
      this.tableDataSource.paginator = this.paginator;
    });
  }

  /**
   * Apply a filter, calls to super class
   * @param event filter by the user
   */
  public applyFilter(event: Event): void {
    this.tableDataSource = super.applyFilter(event, this.tableDataSource);
    this.noResults = this.tableDataSource.filteredData.length === 0;
  }

  /**
   * Apply a filter by status
   * @param event filter by the user
   */
  applyStateFilter(event: any): void {
    this.resetVaribles();
    if (event.index === 0) {
      this.getEvaluators(CommonConstants.MODEL_STATUS.ALL);
    } else if (event.index === 1) {
      this.getEvaluators(CommonConstants.MODEL_STATUS.ACTIVE);
    } else if (event.index === 2) {
      this.getEvaluators(CommonConstants.MODEL_STATUS.INACTIVE);
    }
  }

  /**
   * Call a modal to create the evaluators
   */
  newEvaluator(): void {
    this.manageModalInformation = EvaluatorConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.manageEvaluatorService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.btnCancelTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.NEW,
      () => {
        this.getEvaluators(null);
      },
      () => {},
    );
  }

  /**
   * Concat the disabilities
   * @param data list to apply the labels
   */
  setTypeDisabilitiesLabels(data: any): any[] {
    let disabilitiesConcat = '';
    for (const evaluator of data) {
      disabilitiesConcat = '';
      evaluator.disabilities.map(disability => {
        disabilitiesConcat += disability.name + ', ';
      });
      evaluator.disabilitiesString = disabilitiesConcat.slice(
        0,
        disabilitiesConcat.length - 2,
      );
    }
    return data;
  }

  /**
   * Call a modal to edit the evaluators
   * @param evaluatorToEdit
   */
  editEvaluator(evaluatorToEdit: Evaluator): void {
    this.manageModalInformation = EvaluatorConstants.MANAGE_MODAL_OPTIONS(
      true,
      this.langIANA,
    );
    this.manageEvaluatorService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.btnCancelTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.UPDATE,
      () => {
        this.getEvaluators(null);
      },
      () => {},
      evaluatorToEdit,
    );
  }
}

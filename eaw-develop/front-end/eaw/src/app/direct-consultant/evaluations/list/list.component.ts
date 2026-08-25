import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  ViewChild,
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {TranslateCacheService} from 'ngx-translate-cache';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';

import {GenericList} from 'src/app/shared/abstract-classes/list/list.abstract';
import {ListConstants} from './list.constants';
import {SharedService} from '../../../shared/shared.service';
import {EvaluationsService} from '../evaluations.service';
import {SelectionPageService} from '../../../shared/list-evaluations/list-evaluations/selection-page/selection-page.service';
import {CommonConstants} from '../../../common/common.constants';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [EvaluationsService, SelectionPageService],
})
export class ListComponent extends GenericList implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();

  public year: string;
  public indirectClient: string;
  public clientId: number;
  public segmentId: number;

  public searchFilter: string;
  public listEvaluations: any[];
  public displayedColumns: string[];
  public tableDataSource: any;

  public isEmpty: boolean;
  public noResults: boolean;
  public langIANA: string;
  public emptyMessages: any;
  public evaluationsStates: any;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private sharedService: SharedService,
    private evaluationService: EvaluationsService,
    private selectionModalService: SelectionPageService,
  ) {
    super();
    this.evaluationsStates = CommonConstants.EVALUATIONS_STATES;

    this.activatedRoute.params.subscribe(params => {
      this.year = params.year;
      this.clientId = params['client-id'];
      this.segmentId = params['segment-id'];
      this.indirectClient = params['indirect-client'];
    });
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.setHTMLTitle(this.langIANA);
    this.emptyMessages = ListConstants.EMPTY_RESULTS[this.langIANA];
    this.displayedColumns = ListConstants.TABLE_COLUMS;

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.emptyMessages = ListConstants.EMPTY_RESULTS[event.lang];
      this.setHTMLTitle(this.langIANA);
    });
  }

  ngOnInit() {
    this.getEvaluationsByIndirectClient();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
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
   * Change the HTML title
   * @param language string language
   */
  private setHTMLTitle(language: string) {
    this.sharedService.setTitle(ListConstants.HTML_TITLE[language].title);
  }

  private getEvaluationsByIndirectClient() {
    this.evaluationService
      .getEvaluationsByIndirectClient(
        this.clientId,
        this.year,
        this.segmentId,
        this.indirectClient,
      )
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listEvaluations = this.setStatusLabel(data.results);
        this.isEmpty = this.listEvaluations.length === 0;
        this.tableDataSource = new MatTableDataSource<any>(
          this.listEvaluations,
        );
        this.initTableLabels(this.paginator);
        this.tableDataSource.paginator = this.paginator;
      });
  }

  /**
   * Open a modal with a list of specifications
   * @param evaluation
   */
  public openSpecificationsModal(evaluation) {
    this.selectionModalService.openDialog(
      evaluation,
      () => {},
      () => {},
    );
  }

  /**
   * Redirect to view results
   * @param evaluation selected
   */
  public seeResults(evaluation: any): void {
    this.router.navigate(
      ['detail', 'results', evaluation.id, 'statistics', 'stats'],
      {
        relativeTo: this.activatedRoute.parent,
      },
    );
  }

  /**
   * Redirecto to steps filter
   */
  public goBack() {
    console.log(this.activatedRoute.parent);
    this.router.navigate(['selection'], {
      relativeTo: this.activatedRoute.parent,
    });
  }
}

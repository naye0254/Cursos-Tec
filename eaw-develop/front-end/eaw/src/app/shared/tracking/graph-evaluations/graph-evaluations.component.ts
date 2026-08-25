import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

import {TrackingPageConstants} from '../tracking.constants';
import {SharedService} from '../../../shared/shared.service';
import {TrackingService} from '../tracking.service';

@Component({
  selector: 'app-graph-evaluations',
  templateUrl: './graph-evaluations.component.html',
  styleUrls: ['./graph-evaluations.component.scss'],
  providers: [TrackingPageConstants],
})

/**
 * Component to list a pages evaluated by promoter and evaluator
 */
export class GraphEvaluationsComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public langIANA: string;
  public emptyMessages: any;
  public displayedColumns: string[];
  public tableDataSource: any;
  public isEmpty: boolean;
  public evaluationInfo: any;
  public evaluatorId: number;
  public evaluationId: number;
  public evaluationsStates: any;

  /**
   * Construtor of the component
   * @param sharedService
   * @param translate
   * @param translateCacheService
   * @param trackingService
   * @param activatedRoute
   */
  constructor(
    private sharedService: SharedService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private trackingService: TrackingService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.emptyMessages =
      TrackingPageConstants.EMPTY_RESULTS_GRAPHS[this.langIANA];
    this.setHTMLTitle(this.langIANA);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.emptyMessages =
        TrackingPageConstants.EMPTY_RESULTS_GRAPHS[this.langIANA];
      this.setHTMLTitle(this.langIANA);
    });
    this.displayedColumns = TrackingPageConstants.TABLE_GRAPH;
    this.isEmpty = true;
    this.evaluatorId = 0;
    this.evaluationId = 0;
  }

  ngOnInit() {
    this.evaluatorId = +this.activatedRoute.snapshot.paramMap.get(
      'evaluatorId',
    );
    this.evaluationId = +this.activatedRoute.snapshot.paramMap.get(
      'evaluationId',
    );
    this.getPageEvaluated();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * List page by state evaluation
   */
  public getPageEvaluated() {
    this.trackingService
      .getEvaluationsPagesState<any>(this.evaluationId, this.evaluatorId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.evaluationInfo = data.results.evaluationInfo;
        if (data.results.pagesEvaluated.length !== 0) {
          this.tableDataSource = new MatTableDataSource<any>(
            data.results.pagesEvaluated,
          );
          this.isEmpty = false;
        } else {
          this.isEmpty = true;
        }
      });
  }

  /**
   * Change the HTML title
   * @param language string language
   */
  private setHTMLTitle(language: string) {
    this.sharedService.setTitle(
      TrackingPageConstants.HTML_TITLE_GRAPHS[language].title,
    );
  }

  /**
   * Format a date with a specific command
   * @param dateToFormat
   */
  public formatDate(dateToFormat): any {
    let returnDate = null;
    if (dateToFormat) {
      returnDate = this.sharedService.formatDate(
        dateToFormat,
        'DD-MM-YYYY HH:MM',
      );
    } else {
      returnDate = '-';
    }
    return returnDate;
  }
}

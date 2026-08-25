import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

import {TrackingPageConstants} from '../tracking.constants';
import {SharedService} from '../../../shared/shared.service';
import {TrackingService} from '../tracking.service';

@Component({
  selector: 'app-list-evaluations',
  templateUrl: './list-evaluations.component.html',
  styleUrls: ['./list-evaluations.component.scss'],
  providers: [TrackingPageConstants],
})

/**
 * Component to list a evaluation assigned to a evaluator
 */
export class ListEvaluationsComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public langIANA: string;
  public emptyMessages: any;
  public displayedColumns: string[];
  public tableDataSource: any;
  public isEmpty: boolean;
  public evaluatorInfo: any;
  public evaluatorId: number;
  public evaluationsStates: any;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  /**
   * Constructor of the component
   * @param activatedRoute
   * @param sharedService
   * @param translate
   * @param translateCacheService
   * @param trackingService
   * @param router
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private trackingService: TrackingService,
    private router: Router,
  ) {
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.emptyMessages = TrackingPageConstants.EMPTY_RESULTS[this.langIANA];
    this.setHTMLTitle(this.langIANA);

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.emptyMessages = TrackingPageConstants.EMPTY_RESULTS[this.langIANA];
      this.setHTMLTitle(this.langIANA);
    });
    this.displayedColumns = TrackingPageConstants.TABLE_COLUMS;
    this.isEmpty = true;
    this.evaluatorId = 0;
    this.evaluationsStates = {
      manualEvaluationState: 0,
      automaticEvaluationState: 0,
    };
  }

  ngOnInit() {
    const userDetail = JSON.parse(
      this.sharedService.getItemFromLocalStorage('userDetail'),
    );
    this.evaluatorId = +this.activatedRoute.snapshot.paramMap.get(
      'evaluatorId',
    );
    this.getQuantityEvaluationCreated(userDetail.id, this.evaluatorId);
    this.getEvaluationsByEvaluator();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Call the service to get quantity evaluations by promoter and evaluator
   * @param promoterId
   */
  getQuantityEvaluationCreated(promoterId: number, evaluatorId: number): void {
    this.trackingService
      .getQuantityEvaluationByPromoterAndEvaluator<any>(promoterId, evaluatorId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.trackingService.setQuantityEvalPromoterEvaluator(data.results);
      });
  }

  /**
   * List evaluations by evaluator
   */
  public getEvaluationsByEvaluator() {
    this.trackingService
      .getEvaluationsByEvaluator<any>(
        this.evaluationsStates.manualEvaluationState,
        this.evaluationsStates.automaticEvaluationState,
        this.evaluatorId,
      )
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.evaluatorInfo = data.results.evaluatorInfo[0];
        if (data.results.listEvaluations.length !== 0) {
          this.tableDataSource = new MatTableDataSource<any>(
            data.results.listEvaluations,
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
      TrackingPageConstants.HTML_TITLE_LIST_EVALUATIONS[language].title,
    );
  }

  /**
   * Format a date with a specific command
   * @param dateToFormat
   */
  public formatDate(dateToFormat): any {
    let returnDate = null;
    if (dateToFormat) {
      returnDate = this.sharedService.formatDate(dateToFormat);
    } else {
      returnDate = '-';
    }
    return returnDate;
  }

  /**
   * Apply filter by state
   * @param event
   */
  public applyStateFilter(event: any): any {
    if (event.index === 0) {
      this.evaluationsStates.manualEvaluationState = 0;
      this.evaluationsStates.automaticEvaluationState = 0;
    } else if (event.index === 1) {
      this.evaluationsStates.manualEvaluationState = 1;
      this.evaluationsStates.automaticEvaluationState = 1;
    } else if (event.index === 2) {
      this.evaluationsStates.manualEvaluationState = 2;
      this.evaluationsStates.automaticEvaluationState = 2;
    }
    this.getEvaluationsByEvaluator();
  }

  /**
   * Go to the stats page
   * @param evalautionId
   */
  goToStats(evalautionId: number): void {
    this.router.navigate(['graph-evaluation', evalautionId, this.evaluatorId], {
      relativeTo: this.activatedRoute.parent,
    });
  }
}

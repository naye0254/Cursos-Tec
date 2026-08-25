import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TranslateCacheService} from 'ngx-translate-cache';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

import {Segments} from '../../../../models/segments.model';
import {SegmentsService} from '../segments.service';
import {SegmentsConstants} from '../segments.constants';
import {CommonConstants} from '../../../../common/common.constants';
import {ManageSegmentService} from '../manage-segment/manage-segment.service';
import {SharedService} from '../../../../shared/shared.service';
import {GenericList} from '../../../../shared/abstract-classes/list/list.abstract';

@Component({
  selector: 'app-list-segments',
  templateUrl: './list-segments.component.html',
  styleUrls: ['./list-segments.component.scss'],
  providers: [
    SegmentsConstants,
    ManageSegmentService,
    CommonConstants,
    SegmentsService,
  ],
})
/**
 * Component to list segments
 * Extends the GenericList class to reuse shared functions
 */
export class ListSegmentsComponent extends GenericList
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();

  public searchFilter: string;
  public listSegments: Segments[];
  public displayedColumns: string[];
  public tableDataSource: any;
  public manageModalInformation: any;
  public isEmpty: boolean;
  public noResults: boolean;
  public langIANA: string;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  public emptyMessages: any;

  /**
   * Constructor of the component
   * @param sharedService
   * @param manageSegmentService
   */
  constructor(
    private sharedService: SharedService,
    private manageSegmentService: ManageSegmentService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private segmentsService: SegmentsService,
  ) {
    super();
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.emptyMessages = SegmentsConstants.EMPTY_RESULTS[this.langIANA];
    this.setHTMLTitle(this.langIANA);

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.emptyMessages = SegmentsConstants.EMPTY_RESULTS[event.lang];
      this.setHTMLTitle(this.langIANA);
    });
    this.manageModalInformation = SegmentsConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.resetVaribles();
  }

  ngOnInit() {
    this.getSegments(null);
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Change the HTML title
   * @param language string language
   */
  private setHTMLTitle(language: string) {
    this.sharedService.setTitle(SegmentsConstants.HTML_TITLE[language].title);
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
   * @param event filter by the segment
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
    if (event.index === 0) {
      this.getSegments(CommonConstants.MODEL_STATUS.ALL);
    } else if (event.index === 1) {
      this.getSegments(CommonConstants.MODEL_STATUS.ACTIVE);
    } else if (event.index === 2) {
      this.getSegments(CommonConstants.MODEL_STATUS.INACTIVE);
    }
  }

  /**
   * List segments
   */
  public getSegments(status) {
    this.segmentsService
      .getAllSegments<any>(status)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listSegments = this.setStatusLabel(data.results);
        this.isEmpty = this.listSegments.length === 0;
        this.displayedColumns = SegmentsConstants.TABLE_COLUMS;
        this.tableDataSource = new MatTableDataSource<Segments>(
          this.listSegments,
        );
        this.initTableLabels(this.paginator);
        this.tableDataSource.paginator = this.paginator;
      });
  }

  /**
   * Call a modal to create a segment
   */
  public newSegment(): void {
    this.manageModalInformation = SegmentsConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.manageSegmentService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.bodyText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.btnCancelTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.NEW,
      () => {
        this.getSegments(null);
      },
      () => {},
    );
  }

  /**
   * Call a modal to edit a segment
   * @param segmentItem item to edit
   */
  public editPackage(segmentItem: Segments): void {
    this.manageModalInformation = SegmentsConstants.MANAGE_MODAL_OPTIONS(
      true,
      this.langIANA,
    );
    this.manageSegmentService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.bodyText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.btnCancelTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.UPDATE,
      () => {
        this.getSegments(null);
      },
      () => {},
      segmentItem,
    );
  }
}

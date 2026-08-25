import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TranslateCacheService} from 'ngx-translate-cache';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

import {Browsers} from '../../../../../models/browsers.model';
import {BrowsersConstants} from '../browsers.constants';
import {CommonConstants} from '../../../../../common/common.constants';
import {ManageBrowsersService} from '../manage-browsers/manage-browsers.service';
import {SharedService} from '../../../../../shared/shared.service';
import {GenericList} from '../../../../../shared/abstract-classes/list/list.abstract';

@Component({
  selector: 'app-list-browsers',
  templateUrl: './list-browsers.component.html',
  styleUrls: ['./list-browsers.component.scss'],
  providers: [BrowsersConstants, ManageBrowsersService, CommonConstants],
})
/**
 * Component to list browsers
 * Extends the GenericList class to reuse shared functions
 */
export class ListBrowsersComponent extends GenericList
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();

  public searchFilter: string;
  public listBrowsers: Browsers[];
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
   */
  constructor(
    private sharedService: SharedService,
    private manageBrowsersService: ManageBrowsersService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    super();
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.emptyMessages = BrowsersConstants.EMPTY_RESULTS[this.langIANA];
    this.setHTMLTitle(this.langIANA);

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.emptyMessages = BrowsersConstants.EMPTY_RESULTS[event.lang];
      this.setHTMLTitle(this.langIANA);
    });
    this.manageModalInformation = BrowsersConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.resetVaribles();
  }

  ngOnInit() {
    this.getBrowsers(null);
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
    this.sharedService.setTitle(BrowsersConstants.HTML_TITLE[language].title);
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
   * @param event filter by the browser
   */
  public applyFilter(event: Event): void {
    this.tableDataSource = super.applyFilter(event, this.tableDataSource);
    this.noResults = this.tableDataSource.filteredData.length === 0;
  }

  /**
   * Apply a filter by status
   * @param event filter by the browser
   */
  public applyStateFilter(event: any): void {
    this.resetVaribles();
    if (event.index === 0) {
      this.getBrowsers(CommonConstants.MODEL_STATUS.ALL);
    } else if (event.index === 1) {
      this.getBrowsers(CommonConstants.MODEL_STATUS.ACTIVE);
    } else if (event.index === 2) {
      this.getBrowsers(CommonConstants.MODEL_STATUS.INACTIVE);
    }
  }

  /**
   * List browsers
   */
  public getBrowsers(status) {
    this.sharedService
      .getModelListByStatus<Browsers>('Browsers', status)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listBrowsers = this.setStatusLabel(data);
        this.isEmpty = this.listBrowsers.length === 0;
        this.displayedColumns = BrowsersConstants.TABLE_COLUMS;
        this.tableDataSource = new MatTableDataSource<Browsers>(
          this.listBrowsers,
        );
        this.initTableLabels(this.paginator);
        this.tableDataSource.paginator = this.paginator;
      });
  }

  /**
   * Call a modal to create a browser
   */
  public newBrowser(): void {
    this.manageModalInformation = BrowsersConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.manageBrowsersService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.bodyText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.btnCancelTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.NEW,
      () => {
        this.getBrowsers(null);
      },
      () => {},
    );
  }

  /**
   * Call a modal to edit a browser
   * @param browserItem item to edit
   */
  public editBrowser(browserItem: Browsers): void {
    this.manageModalInformation = BrowsersConstants.MANAGE_MODAL_OPTIONS(
      true,
      this.langIANA,
    );
    this.manageBrowsersService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.bodyText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.btnCancelTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.UPDATE,
      () => {
        this.getBrowsers(null);
      },
      () => {},
      browserItem,
    );
  }
}

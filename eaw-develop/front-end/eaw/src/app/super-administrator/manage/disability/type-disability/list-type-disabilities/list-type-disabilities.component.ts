import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {Disabilities} from '../../../../../models/disabilities.model';
import {TypeDisablitiesConstants} from '../type-disability.constants';
import {CommonConstants} from '../../../../../common/common.constants';
import {ManageDisabilityService} from '../manage-disability/manage-disability.service';
import {SharedService} from '../../../../../shared/shared.service';
import {GenericList} from '../../../../../shared/abstract-classes/list/list.abstract';

@Component({
  selector: 'app-list-type-disabilities',
  templateUrl: './list-type-disabilities.component.html',
  styleUrls: ['./list-type-disabilities.component.scss'],
  providers: [
    TypeDisablitiesConstants,
    ManageDisabilityService,
    CommonConstants,
  ],
})
/**
 * List of disabilities type
 * Extends the GenericList class to reuse shared functions
 */
export class ListTypeDisabilitysComponent extends GenericList
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();

  public emptyMessages: any;
  public searchFilter: string;
  public listDisabilities: Disabilities[];
  public displayedColumns: string[];
  public tableDataSource: any;
  public manageModalInformation: any;
  public isEmpty: boolean;
  public noResults: boolean;
  public langIANA: string;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  /**
   * Constructor of the model
   * @param sharedService
   * @param manageDisabilityService
   */
  constructor(
    private sharedService: SharedService,
    private manageDisabilityService: ManageDisabilityService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    super();
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.emptyMessages = TypeDisablitiesConstants.EMPTY_RESULTS[this.langIANA];
    this.setHTMLTitle(this.langIANA);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.emptyMessages =
        TypeDisablitiesConstants.EMPTY_RESULTS[this.langIANA];
      this.setHTMLTitle(this.langIANA);
    });
    this.manageModalInformation = TypeDisablitiesConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.resetVaribles();
  }

  ngOnInit() {
    this.getDisabilities(null);
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
    this.sharedService.setTitle(
      TypeDisablitiesConstants.HTML_TITLE[language].title,
    );
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
  public applyStateFilter(event: any): void {
    this.resetVaribles();
    if (event.index === 0) {
      this.getDisabilities(CommonConstants.MODEL_STATUS.ALL);
    } else if (event.index === 1) {
      this.getDisabilities(CommonConstants.MODEL_STATUS.ACTIVE);
    } else if (event.index === 2) {
      this.getDisabilities(CommonConstants.MODEL_STATUS.INACTIVE);
    }
  }

  /**
   * List types disabilities
   */
  public getDisabilities(status) {
    this.sharedService
      .getModelListByStatus<Disabilities>('Disabilities', status)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listDisabilities = this.setStatusLabel(data);
        this.isEmpty = this.listDisabilities.length === 0;
        this.displayedColumns = TypeDisablitiesConstants.TABLE_COLUMS;
        this.tableDataSource = new MatTableDataSource<Disabilities>(
          this.listDisabilities,
        );
        this.initTableLabels(this.paginator);
        this.tableDataSource.paginator = this.paginator;
      });
  }

  /**
   * Call a modal to create a package
   */
  public newDisability(): void {
    this.manageModalInformation = TypeDisablitiesConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.manageDisabilityService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.btnCancelTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.NEW,
      () => {
        this.getDisabilities(null);
      },
      () => {},
    );
  }

  /**
   * Call a modal to edit a package
   * @param disabilityItem item to edit
   */
  public editDisability(disabilityItem: Disabilities): void {
    this.manageModalInformation = TypeDisablitiesConstants.MANAGE_MODAL_OPTIONS(
      true,
      this.langIANA,
    );
    this.manageDisabilityService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.btnCancelTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.UPDATE,
      () => {
        this.getDisabilities(null);
      },
      () => {},
      disabilityItem,
    );
  }
}

import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {Promoter} from '../../../../models/promoter.model';
import {PromotersPageConstants} from '../promoters.constants';
import {ManagePromoterService} from '../manage-promoter/manage-promoter.service';
import {SharedService} from '../../../../shared/shared.service';
import {CommonConstants} from '../../../../common/common.constants';
import {GenericList} from '../../../../shared/abstract-classes/list/list.abstract';
import {PromotersService} from '../promoters.service';

@Component({
  selector: 'app-list-promoters',
  templateUrl: './list-promoters.component.html',
  styleUrls: ['./list-promoters.component.scss'],
  providers: [
    PromotersPageConstants,
    ManagePromoterService,
    CommonConstants,
    PromotersService,
  ],
})
/**
 * Component to list packages
 * Extends the GenericList class to reuse shared functions
 */
export class ListPromotersComponent extends GenericList
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public searchFilter: string;
  public listPromoters: Promoter[] = [];
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
   * @param managePromoterService
   * @param sharedService
   */
  constructor(
    private managePromoterService: ManagePromoterService,
    private sharedService: SharedService,
    private promotersService: PromotersService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    super();
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.emptyMessages = PromotersPageConstants.EMPTY_RESULTS[this.langIANA];
    this.setHTMLTitle(this.langIANA);

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.emptyMessages = PromotersPageConstants.EMPTY_RESULTS[this.langIANA];
      this.setHTMLTitle(this.langIANA);
    });

    this.displayedColumns = PromotersPageConstants.TABLE_COLUMS;
    this.tableDataSource = new MatTableDataSource<Promoter>(this.listPromoters);
    this.manageModalInformation = PromotersPageConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.resetVaribles();
  }

  ngOnInit() {
    this.getPromoters(null);
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
      PromotersPageConstants.HTML_TITLE[language].title,
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
   * Take a list of promoters by the status
   * @param status if the promoter is active
   */
  private getPromoters(status) {
    this.promotersService.getAllPromoters<any>(status).subscribe(data => {
      this.listPromoters = this.setStatusLabel(data.results);
      this.isEmpty = this.listPromoters.length === 0;
      this.displayedColumns = PromotersPageConstants.TABLE_COLUMS;
      this.tableDataSource = new MatTableDataSource<Promoter>(
        this.listPromoters,
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
      this.getPromoters(CommonConstants.MODEL_STATUS.ALL);
    } else if (event.index === 1) {
      this.getPromoters(CommonConstants.MODEL_STATUS.ACTIVE);
    } else if (event.index === 2) {
      this.getPromoters(CommonConstants.MODEL_STATUS.INACTIVE);
    }
  }

  /**
   * Call a modal to create the promoters
   */
  newPrometer(): void {
    this.manageModalInformation = PromotersPageConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.managePromoterService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.btnCancelTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.NEW,
      () => {
        this.getPromoters(null);
      },
      () => {},
    );
  }

  /**
   * Call a modal to edit the promoters
   * @param promoterToEdit
   */
  editPromoter(promoterToEdit: Promoter): void {
    this.manageModalInformation = PromotersPageConstants.MANAGE_MODAL_OPTIONS(
      true,
      this.langIANA,
    );
    this.managePromoterService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.btnCancelTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.UPDATE,
      () => {
        this.getPromoters(null);
      },
      () => {},
      promoterToEdit,
    );
  }
}

import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TranslateCacheService} from 'ngx-translate-cache';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

import {Packages} from '../../../../../models/packages.model';
import {PackagesConstants} from '../packages.constants';
import {CommonConstants} from '../../../../../common/common.constants';
import {ManagePackageService} from '../manage-package/manage-package.service';
import {SharedService} from '../../../../../shared/shared.service';
import {GenericList} from '../../../../../shared/abstract-classes/list/list.abstract';

@Component({
  selector: 'app-list-packages',
  templateUrl: './list-packages.component.html',
  styleUrls: ['./list-packages.component.scss'],
  providers: [PackagesConstants, ManagePackageService, CommonConstants],
})
/**
 * Component to list packages
 * Extends the GenericList class to reuse shared functions
 */
export class ListPackagesComponent extends GenericList
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();

  public searchFilter: string;
  public listPackages: Packages[];
  public displayedColumns: string[];
  public tableDataSource: any;
  public manageModalInformation: any;
  public isEmpty: boolean;
  public noResults: boolean;
  public langIANA: string;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  public emptyMessages: any;

  /**
   * Constructor of the model
   * @param sharedService
   * @param managePackageService
   */
  constructor(
    private sharedService: SharedService,
    private managePackageService: ManagePackageService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    super();
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.emptyMessages = PackagesConstants.EMPTY_RESULTS[this.langIANA];
    this.setHTMLTitle(this.langIANA);

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.emptyMessages = PackagesConstants.EMPTY_RESULTS[event.lang];
      this.setHTMLTitle(this.langIANA);
    });
    this.manageModalInformation = PackagesConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.resetVaribles();
  }

  ngOnInit() {
    this.getPackages(null);
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
    this.sharedService.setTitle(PackagesConstants.HTML_TITLE[language].title);
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
      this.getPackages(CommonConstants.MODEL_STATUS.ALL);
    } else if (event.index === 1) {
      this.getPackages(CommonConstants.MODEL_STATUS.ACTIVE);
    } else if (event.index === 2) {
      this.getPackages(CommonConstants.MODEL_STATUS.INACTIVE);
    }
  }

  /**
   * List packages
   */
  public getPackages(status) {
    this.sharedService
      .getModelListByStatus<Packages>('Packages', status)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listPackages = this.setStatusLabel(data);
        this.isEmpty = this.listPackages.length === 0;
        this.displayedColumns = PackagesConstants.TABLE_COLUMS;
        this.tableDataSource = new MatTableDataSource<Packages>(
          this.listPackages,
        );
        this.initTableLabels(this.paginator);
        this.tableDataSource.paginator = this.paginator;
      });
  }

  /**
   * Note: This function is currently not supported.
   *
   * Call a modal to create a package
   */
  public newPackage(): void {
    this.manageModalInformation = PackagesConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.managePackageService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.bodyText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.btnCancelTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.NEW,
      () => {
        this.getPackages(null);
      },
      () => {},
    );
  }

  /**
   * Note: This function is currently not supported.
   *
   * Call a modal to edit a package
   * @param packageItem item to edit
   */
  public editPackage(packageItem: Packages): void {
    this.manageModalInformation = PackagesConstants.MANAGE_MODAL_OPTIONS(
      true,
      this.langIANA,
    );
    this.managePackageService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.bodyText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.btnCancelTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.UPDATE,
      () => {
        this.getPackages(null);
      },
      () => {},
      packageItem,
    );
  }
}

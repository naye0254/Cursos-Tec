import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {SupportToolsConstants} from '../support-tools.constants';
import {CommonConstants} from '../../../../../common/common.constants';
import {SharedService} from '../../../../../shared/shared.service';
import {SupportTools} from '../../../../../models/supportTools.model';
import {GenericList} from '../../../../../shared/abstract-classes/list/list.abstract';
import {SupportToolsService} from '../support-tools.service';
import {ManageSupportToolsService} from '../manage-support-tools/manage-support-tools.service';

@Component({
  selector: 'app-list-support-tools',
  templateUrl: './list-support-tools.component.html',
  styleUrls: ['./list-support-tools.component.scss'],
  providers: [
    SupportToolsConstants,
    CommonConstants,
    SupportToolsService,
    ManageSupportToolsService,
  ],
})
export class ListSupportToolsComponent extends GenericList
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();

  public displayedColumns: string[];
  public emptyMessages: any;
  public searchFilter: string;
  public listSupportTools: SupportTools[];
  public tableDataSource: any;
  public manageModalInformation: any;
  public isEmpty: boolean;
  public noResults: boolean;
  public langIANA: string;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public sharedService: SharedService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private supportToolsService: SupportToolsService,
    private manageSupportToolsService: ManageSupportToolsService,
  ) {
    super();
    this.displayedColumns = SupportToolsConstants.TABLE_COLUMS;
    this.langIANA = translateCacheService.getCachedLanguage();
    this.emptyMessages =
      SupportToolsConstants.EMPTY_RESULTS[
        translateCacheService.getCachedLanguage()
      ];
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.emptyMessages = SupportToolsConstants.EMPTY_RESULTS[event.lang];
    });
    this.manageModalInformation = SupportToolsConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.resetVaribles();
  }

  ngOnInit() {
    this.getSupportTools(null);
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
   * List support tools
   */
  public getSupportTools(status) {
    this.supportToolsService.getAllSupportTools<any>(status).subscribe(data => {
      this.listSupportTools = this.setStatusLabel(data.results);
      this.listSupportTools = this.setTypeDisabilitiesLabels(data.results);
      this.isEmpty = this.listSupportTools.length === 0;
      this.displayedColumns = SupportToolsConstants.TABLE_COLUMS;
      this.tableDataSource = new MatTableDataSource<SupportTools>(
        this.listSupportTools,
      );
      this.initTableLabels(this.paginator);
      this.tableDataSource.paginator = this.paginator;
    });
  }

  /**
   * Concat the disabilities
   * @param data list to apply the labels
   */
  setTypeDisabilitiesLabels(data: any): any[] {
    let disabilitiesConcat = '';
    for (const supportTool of data) {
      disabilitiesConcat = '';
      supportTool.disabilities.map(disability => {
        disabilitiesConcat += disability.name + ', ';
      });
      supportTool.disabilitiesString = disabilitiesConcat;
    }
    return data;
  }

  /**
   * Call a modal to create the new support tool
   */
  newSupportTool(): void {
    this.manageModalInformation = SupportToolsConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.manageSupportToolsService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.NEW,
      () => {
        this.getSupportTools(null);
      },
      () => {},
    );
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
   * @param event filter by the state
   */
  applyStateFilter(event: any): void {
    this.resetVaribles();
    if (event.index === 0) {
      this.getSupportTools(CommonConstants.MODEL_STATUS.ALL);
    } else if (event.index === 1) {
      this.getSupportTools(CommonConstants.MODEL_STATUS.ACTIVE);
    } else if (event.index === 2) {
      this.getSupportTools(CommonConstants.MODEL_STATUS.INACTIVE);
    }
  }

  /**
   * Call a modal to edit a package
   * @param supportToolItem item to edit
   */
  public editSupportTool(supportToolItem: SupportTools): void {
    this.manageModalInformation = SupportToolsConstants.MANAGE_MODAL_OPTIONS(
      true,
      this.langIANA,
    );
    this.manageSupportToolsService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.UPDATE,
      () => {
        this.getSupportTools(null);
      },
      () => {},
      supportToolItem,
    );
  }
}

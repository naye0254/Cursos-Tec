import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TranslateCacheService} from 'ngx-translate-cache';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

import {Devices} from '../../../../../models/devices.model';
import {DevicesConstants} from '../devices.constants';
import {CommonConstants} from '../../../../../common/common.constants';
import {ManageDeviceService} from '../manage-devices/manage-devices.service';
import {SharedService} from '../../../../../shared/shared.service';
import {GenericList} from '../../../../../shared/abstract-classes/list/list.abstract';
import {DevicesService} from '../devices.services';

@Component({
  selector: 'app-lists-devices',
  templateUrl: './lists-devices.component.html',
  styleUrls: ['./lists-devices.component.scss'],
  providers: [
    DevicesConstants,
    ManageDeviceService,
    CommonConstants,
    DevicesService,
  ],
})
/**
 * Component to list devices
 * Extends the GenericList class to reuse shared functions
 */
export class ListsDevicesComponent extends GenericList
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();

  public searchFilter: string;
  public listDevices: Devices[];
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
    private manageDeviceService: ManageDeviceService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private devicesService: DevicesService,
  ) {
    super();
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.emptyMessages = DevicesConstants.EMPTY_RESULTS[this.langIANA];
    this.setHTMLTitle(this.langIANA);

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.emptyMessages = DevicesConstants.EMPTY_RESULTS[event.lang];
      this.setHTMLTitle(this.langIANA);
    });
    this.manageModalInformation = DevicesConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.resetVaribles();
  }

  ngOnInit() {
    this.getDevices(null);
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
    this.sharedService.setTitle(DevicesConstants.HTML_TITLE[language].title);
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
   * @param event filter by the device
   */
  public applyFilter(event: Event): void {
    this.tableDataSource = super.applyFilter(event, this.tableDataSource);
    this.noResults = this.tableDataSource.filteredData.length === 0;
  }

  /**
   * Apply a filter by status
   * @param event filter by the device
   */
  public applyStateFilter(event: any): void {
    this.resetVaribles();
    if (event.index === 0) {
      this.getDevices(CommonConstants.MODEL_STATUS.ALL);
    } else if (event.index === 1) {
      this.getDevices(CommonConstants.MODEL_STATUS.ACTIVE);
    } else if (event.index === 2) {
      this.getDevices(CommonConstants.MODEL_STATUS.INACTIVE);
    }
  }

  /**
   * List devices
   */
  public getDevices(status) {
    this.devicesService
      .getAllDevices<any>(status)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listDevices = this.setStatusLabel(data.results);
        this.isEmpty = this.listDevices.length === 0;
        this.displayedColumns = DevicesConstants.TABLE_COLUMS;
        this.tableDataSource = new MatTableDataSource<Devices>(
          this.listDevices,
        );
        this.initTableLabels(this.paginator);
        this.tableDataSource.paginator = this.paginator;
      });
  }

  /**
   * Call a modal to create a device
   */
  public newDevice(): void {
    this.manageModalInformation = DevicesConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.manageDeviceService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.bodyText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.btnCancelTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.NEW,
      () => {
        this.getDevices(null);
      },
      () => {},
    );
  }

  /**
   * Call a modal to edit a device
   * @param deviceItem item to edit
   */
  public editDevice(deviceItem: Devices): void {
    this.manageModalInformation = DevicesConstants.MANAGE_MODAL_OPTIONS(
      true,
      this.langIANA,
    );
    this.manageDeviceService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.bodyText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.btnCancelTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.UPDATE,
      () => {
        this.getDevices(null);
      },
      () => {},
      deviceItem,
    );
  }
}

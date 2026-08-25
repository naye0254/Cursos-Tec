import {Component, OnInit, OnDestroy, ViewChild, Input} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {ClientsService} from '../clients.service';
import {SharedService} from '../../../shared/shared.service';
import {Clients} from '../../../models/clients.model';
import {ClientsPageConstants} from '../clients.constants';
import {CommonConstants} from '../../../common/common.constants';
import {AdvancedSearchService} from '../modal-advanced-search/modal-advanced-search.service';
import {GenericList} from '../../../shared/abstract-classes/list/list.abstract';
import {ActivatedRoute} from '@angular/router';

import {EditClientService} from '../edit-client/edit-client.service';

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss'],
  providers: [
    ClientsPageConstants,
    ClientsService,
    CommonConstants,
    AdvancedSearchService,
    EditClientService,
  ],
})

/**
 * ListClientsComponent manage a client list.
 */
export class ListClientsComponent extends GenericList
  implements OnInit, OnDestroy {
  @Input() roleId: number;
  @Input() title: string;

  public clientList: Clients[];
  public displayedColumns: string[];
  public tableDataSource: any;
  public editModalInformation: any;
  public isEmpty: boolean;
  public noResults: boolean;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  private subscriptions = new Subscription();
  public advanceSearchParameters: any;
  public langIANA: string;
  public emptyMessages: any;
  public formatDate: string;
  public administratorRole: number;
  public superadministratorRole: number;

  /**
   * Constructor method
   * @param activatedRoute
   * @param clientsService
   * @param advancedSearchService
   * @param sharedService
   * @param translate
   * @param translateCacheService
   * @param editClientService
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private clientsService: ClientsService,
    private advancedSearchService: AdvancedSearchService,
    public sharedService: SharedService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private editClientService: EditClientService,
  ) {
    super();
    this.administratorRole = CommonConstants.roles.Promoter;
    this.superadministratorRole = CommonConstants.roles.SuperAdministrator;
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.emptyMessages = ClientsPageConstants.EMPTY_RESULTS[this.langIANA];
    this.setHTMLTitle(this.langIANA);

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.emptyMessages = ClientsPageConstants.EMPTY_RESULTS[this.langIANA];
      this.setHTMLTitle(this.langIANA);
    });

    this.editModalInformation = ClientsPageConstants.MANAGE_MODAL_OPTIONS(true);
    this.advanceSearchParameters = {
      name: null,
      email: null,
      createdBy: null,
      createdAt: null,
      segmentId: null,
      isActive: null,
      isDeleted : null
    };
    this.isEmpty = false;
    this.noResults = false;
    this.formatDate = ClientsPageConstants.FORMAT_DATE;
  }

  ngOnInit() {
    this.getAllClients(this.advanceSearchParameters);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Change the HTML title
   * @param language string language
   */
  private setHTMLTitle(language: string) {
    this.sharedService.setTitle(
      ClientsPageConstants.HTML_TITLE[language].title,
    );
  }

  /**
   * Render table after filter table elements.
   * @param {Event} event
   */
  applyFilter(event: Event): void {
    this.tableDataSource = super.applyFilter(event, this.tableDataSource);
    this.noResults = this.tableDataSource.filteredData.length === 0;
  }

  /**
   * Reset variables
   */
  private resetVaribles() {
    this.isEmpty = false;
    this.noResults = false;
  }

  /**
   * Apply a filter by status
   * @param event filter by the segment
   */
  public applyStateFilter(event: any): void {
    this.resetVaribles();
    if (event.index === 0) {
      this.advanceSearchParameters.isActive = CommonConstants.MODEL_STATUS.ALL;
      this.getAllClients(this.advanceSearchParameters);
    } else if (event.index === 1) {
      this.advanceSearchParameters.isActive =
        CommonConstants.MODEL_STATUS.ACTIVE;
      this.getAllClients(this.advanceSearchParameters);
    } else if (event.index === 2) {
      this.advanceSearchParameters.isActive =
        CommonConstants.MODEL_STATUS.INACTIVE;
      this.getAllClients(this.advanceSearchParameters);
    }
  }

  /**
   * Get all clients using optional parameters
   * @param advanceSearchParameters
   */
  getAllClients(advanceSearchParameters: any) {
    advanceSearchParameters.isActive =
      advanceSearchParameters.isActive == null
        ? `'null'`
        : `${advanceSearchParameters.isActive}`; 

    if (this.roleId === this.administratorRole || this.roleId === this.superadministratorRole) {
      advanceSearchParameters.segmentId = +this.activatedRoute.snapshot.paramMap.get(
        'segmentId',
      );
      if (advanceSearchParameters.segmentId === 0) {
        advanceSearchParameters.segmentId = null;
      }
    }
    this.subscriptions.add(
      this.clientsService
        .advanceSearchClients(
          advanceSearchParameters.name,
          advanceSearchParameters.email,
          null,
          advanceSearchParameters.createdAt,
          advanceSearchParameters.segmentId,
          advanceSearchParameters.isActive,
          0
        )
        .subscribe(data => {
          this.clientList = this.setStatusLabel(data.results);
          this.isEmpty = this.clientList.length === 0;
          this.displayedColumns = ClientsPageConstants.TABLE_COLUMS;
          this.tableDataSource = new MatTableDataSource<Clients>(
            this.clientList,
          );
          this.initTableLabels(this.paginator);
          this.tableDataSource.paginator = this.paginator;
        }),
    );
  }

  /**
   * Function to display modal to advanced search
   */
  displayAdvancedSearch(): void {
    this.editModalInformation = ClientsPageConstants.MANAGE_MODAL_OPTIONS(true);
    const dialogRef = this.advancedSearchService.openDialog(
      this.editModalInformation.title,
      this.editModalInformation.btnOkTextModal,
      this.editModalInformation.btnCancelTextModal,
      this.editModalInformation.withModal,
      () => {
        this.getAllClients(this.advanceSearchParameters);
      },
      () => {},
    );
    this.subscriptions.add(
      dialogRef.afterClosed().subscribe(filterData => {
        if (filterData !== null) {
          this.getAllClients(filterData);
        }
      }),
    );
  }

  /**
   * Open a modal to edit client
   * @param client
   */
  displayEditModal(client: any): void {
    this.editClientService.openDialog(
      client,
      () => {
        this.getAllClients(this.advanceSearchParameters);
      },
      () => {},
    );
  }
}

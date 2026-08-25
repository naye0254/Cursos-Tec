import { Component, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonConstants } from 'src/app/common/common.constants';
import { SuperAdministratorConstants } from 'src/app/super-administrator/super-administrator.constants';
import { SharedService } from '../../shared.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { TranslateCacheService } from 'ngx-translate-cache';
import { AlertService } from 'src/app/utils/alerts/alerts.service';
import { EvaluationsConstants } from './evaluation-report.constants';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ListConstants } from '../../abstract-classes/list/list.constants';
import { GenericList } from '../../abstract-classes/list/list.abstract';
import { SelectionModel } from '@angular/cdk/collections';
import { EvaluationReportService } from '../evaluation-report.service';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-evaluation-report',
  templateUrl: './evaluation-report.component.html',
  styleUrls: ['./evaluation-report.component.scss'],
  providers:[
    CommonConstants,
    SuperAdministratorConstants,
    EvaluationReportService
  ]
})
export class EvaluationReportComponent extends GenericList implements OnInit, OnDestroy, OnChanges {
  protected onDestroy = new Subject<void>();
  public langIANA: string;
  public sidebarSuperAdministratorOptions: any;
  public emptyMessages: any;
  public listEvaluations: any[];
  public userRole: number;
  public isEmpty: boolean;
  public evaluationState: number;
  public evaluationsStates: any;
  public tableDataSource: any;
  public paginationState: any;
  public selection = new SelectionModel<any>(true, []);
  public years = undefined;
  public selectedEvaluations = [];
  public downloadTechnical = new SelectionModel<any>(true, []);
  public downloadManagerial = new SelectionModel<any>(true, []);
  @Output() public evaluationSelected: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  title: any;
  displayedColumns: string[];
  noResults: boolean;
  searchFilter: string;
  constructor(
    private sharedService: SharedService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private alertService: AlertService,
    private evaluationReportService: EvaluationReportService
  ) {
    super();
    this.paginationState = {
      previousPageIndex: 0,
      pageIndex: 1,
      pageSize: 5,
      length: 0,
      itemsPerPage: 0,
      beginRange: 0,
      endRange: 0
    };
    this.getYears();
    this.evaluationState = 2;
    this.evaluationsStates = CommonConstants.EVALUATIONS_STATES;
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.emptyMessages = EvaluationsConstants.EMPTY_RESULTS[this.langIANA];
    this.sidebarSuperAdministratorOptions =
      SuperAdministratorConstants.SIDEBAR_SUPER_ADMINISTRATOR_EVALUATIONS_REPORTS_OPTIONS[
      this.langIANA
      ];
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.sidebarSuperAdministratorOptions =
        SuperAdministratorConstants.SIDEBAR_SUPER_ADMINISTRATOR_EVALUATIONS_REPORTS_OPTIONS[
        event.lang
        ];
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.emptyMessages = EvaluationsConstants.EMPTY_RESULTS[event.lang];
      this.setHTMLTitle(this.langIANA);
    });
    this.resetVaribles();
    this.userRole = this.sharedService.getUserInfoFromLocalStorage().roleTypesId;
    this.setValuesRol();
    this.getEvaluations();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setValuesRol();
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private setHTMLTitle(language: string) {
    this.sharedService.setTitle(EvaluationsConstants.HTML_TITLE[language].title);
  }

  private resetVaribles() {
    this.isEmpty = false;
    this.noResults = false;
    this.searchFilter = '';
  }

  private setValuesRol() {
    if (this.verifyRole(CommonConstants.roles.Evaluator)) {
      this.title = EvaluationsConstants.STR_STATES_PLURAL[this.langIANA]()[this.evaluationState];
      this.displayedColumns = EvaluationsConstants.TABLE_COLUMS_EVALUATOR;
      //this.getEvaluations();
    } else if (this.verifyRole(CommonConstants.roles.Promoter)) {
      this.displayedColumns = EvaluationsConstants.TABLE_COLUMS_PROMOTER;
      this.title = EvaluationsConstants.HTML_TITLE[this.langIANA].title;
      this.evaluationState = this.sharedService.getEvaluationState();
      //this.getEvaluations();
    } else {
      this.displayedColumns = EvaluationsConstants.TABLE_COLUMS;
      this.title = EvaluationsConstants.HTML_TITLE[this.langIANA].title;
      this.evaluationState = this.sharedService.getEvaluationState();
      //this.getEvaluations();
    }
  }

  /**
   * Verify the user role with the role in local storage
   * @param role to verify
   */
  private verifyRole(role: number): boolean {
    return role === this.userRole;
  }

  public setStatusLabel(listItems: any[]): any[] {
    listItems.map(item => {
      if (item.isActive) {
        item.isActiveLabel = 'Activo';
      } else {
        item.isActiveLabel = 'Inactivo';
      }
    });
    return listItems;
  }

  public initTableLabels(paginator: MatPaginator): void {
    paginator._intl.itemsPerPageLabel = ListConstants.TABLE_LABELS.itemPerPage;
    paginator._intl.nextPageLabel = ListConstants.TABLE_LABELS.nextPageLabel;
    paginator._intl.previousPageLabel =
      ListConstants.TABLE_LABELS.previousPageLabel;
    paginator._intl.lastPageLabel = ListConstants.TABLE_LABELS.lastPageLabel;
    paginator._intl.firstPageLabel = ListConstants.TABLE_LABELS.firstPageLabel;
  }

  /**
   * Function to update page quantity from paginator
   * @param paginationState
   * @param count
   */
  public setPaginationState(paginationState, count?: number) {
    if (count) {
      this.paginationState = {
        previousPageIndex: 0,
        pageIndex: 1,
        pageSize: 50,
        length: 0,
        itemsPerPage: 50,
        beginRange: 0,
        endRange: 0
      };
      this.paginationState.length = count;
      this.paginationState.endRange =
        this.paginationState.pageSize > this.tableDataSource.filteredData.length
            ? this.tableDataSource.filteredData.length
            : this.paginationState.pageSize;
    }
    if (paginationState) {
      this.paginationState = paginationState;
      this.paginationState.beginRange =
        ++this.paginationState.pageIndex * this.paginationState.pageSize -
        this.paginationState.pageSize +
        1;
      this.paginationState.endRange =
        this.paginationState.beginRange + this.paginationState.pageSize - 1;
      if (this.paginationState.endRange > this.tableDataSource.filteredData.length) {
        this.paginationState.endRange = this.tableDataSource.filteredData.length;
      }
    }
  }

  public getEvaluations() {
    if (this.verifyRole(CommonConstants.roles.Evaluator)) {
      const userId = this.sharedService.getUserInfoFromLocalStorage().id;
      this.sharedService
        .getEvaluationsByEvaluatorAndState<any>(userId, 2)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(data => {
          this.listEvaluations = this.setStatusLabel(data.results);
          this.isEmpty = this.listEvaluations.length === 0;
          this.tableDataSource = new MatTableDataSource<any>(this.listEvaluations);
          this.initTableLabels(this.paginator);
          this.paginator._changePageSize(50);
          this.tableDataSource.paginator = this.paginator;
          this.setPaginationState(null, data.count);
        });
    } else {
      this.sharedService
        .getAllEvaluations<any>(2)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(data => {
          this.listEvaluations = this.setStatusLabel(data.results);
          this.isEmpty = this.listEvaluations.length === 0;
          this.tableDataSource = new MatTableDataSource<any>(this.listEvaluations);
          this.initTableLabels(this.paginator);
          this.paginator._changePageSize(50);
          this.tableDataSource.paginator = this.paginator;
          this.setPaginationState(null, data.count);
        });
    }
  }

  /*
  Gets all the years of the evaluations
  */
  public getYears(){
    this.evaluationReportService
      .getEvaluationsYears<any>()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.years = data.results;
      });
  }

  /*
  Determines if all the rows of the table are selected
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableDataSource.data.length;
    return numSelected === numRows;
  }

  /*
  Selects all the rows of the table
   */
  masterToggle() {
    var s = 0;
    this.tableDataSource.data.forEach(row => {
      if(this.selection.isSelected(row)){
        s = 1;
      }
    });
    if(!s){
      this.tableDataSource.data.forEach(row => this.selection.select(row));
    }else{
      this.selection.clear();
    }
  }

  /*
  Filters data by year
   */
  filterYear(event : any): void{
    this.selection.clear();
    if(event.value == undefined){
      this.getEvaluations();
    }
    else{
      this.evaluationReportService
        .getEvaluationsByYear(event.value, "2")
        .pipe(takeUntil(this.onDestroy))
        .subscribe(data => {
          this.listEvaluations = this.setStatusLabel(data.results);
          this.isEmpty = this.listEvaluations.length === 0;
          this.tableDataSource = new MatTableDataSource<any>(this.listEvaluations);
          this.initTableLabels(this.paginator);
          this.paginator._changePageSize(50);
          this.tableDataSource.paginator = this.paginator;
          this.setPaginationState(null, data.count);
        });
    }
    this.paginator.pageIndex = 0;
    this.paginationState.pageIndex = 1;
  }

  /**
   Downloads a zip containing all the selected evaluations
   */
  async downloadEvaluationsZip(){
    var zip = new JSZip();
    var tech = undefined;
    var manage = undefined;
    var reportsData = [];
    this.tableDataSource.data.forEach(async row => {
      if(this.selection.isSelected(row)){
        this.evaluationReportService
          .getEvaluationReportFilepaths(row.id)
          .pipe(takeUntil(this.onDestroy))
          .subscribe(async data => {
            var reportDataT = {
              name: "",
              url: "",
              data: undefined
            };
            var reportDataM = {
              name: "",
              url: "",
              data: undefined
            };
            tech = data.technicalReportPath.substring(data.technicalReportPath.lastIndexOf('/') + 1);
            manage = data.managerialReportPath.substring(data.managerialReportPath.lastIndexOf('/') + 1);
            reportDataT.name = tech;
            reportDataM.name = manage;

            var urlTech = this.evaluationReportService.downloadReport(tech);
            var urlManage = this.evaluationReportService.downloadReport(manage);
            reportDataT.url = urlTech;
            reportDataM.url = urlManage;

            if(this.downloadTechnical){
              await JSZipUtils.getBinaryContent(urlTech, async function (err, data) {
                if(err) {
                    throw err; // or handle the error
                }
                reportDataT.data = data;
              });
            }


            await JSZipUtils.getBinaryContent(urlManage, async function (err, data) {
              if(err) {
                  throw err; // or handle the error
              }
              reportDataM.data = data;
            });

            if(this.downloadManagerial){
              reportsData.push(reportDataM);
            }
            if(this.downloadTechnical){
              reportsData.push(reportDataT);
            }
          });
      }
    });
    setTimeout(() => {
      reportsData.forEach(report => {
        zip.file(report.name, report.data, {binary: true})
      });
      setTimeout(() => {
        zip.generateAsync({type: "blob"})
        .then(function(content){
          saveAs(content, "reports.zip");
        });
      }, 2000)
    }, 2000);
  }
}

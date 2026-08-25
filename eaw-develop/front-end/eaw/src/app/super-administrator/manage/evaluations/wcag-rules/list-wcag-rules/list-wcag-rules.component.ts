import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TranslateCacheService} from 'ngx-translate-cache';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

import {Criterions} from '../../../../../models/criterions.model';
import {WcagRulesConstants} from '../wcag-rules.constants';
import {CommonConstants} from '../../../../../common/common.constants';
import {ManageWcagRulesService} from '../manage-wcag-rules/manage-wcag-rules.service';
import {SharedService} from '../../../../../shared/shared.service';
import {GenericList} from '../../../../../shared/abstract-classes/list/list.abstract';
import {WcagRulesService} from '../wcag-rules.service';

@Component({
  selector: 'app-list-wcag-rules',
  templateUrl: './list-wcag-rules.component.html',
  styleUrls: ['./list-wcag-rules.component.scss'],
  providers: [
    WcagRulesConstants,
    ManageWcagRulesService,
    CommonConstants,
    WcagRulesService,
  ],
})
/**
 * Component to list wcag rules
 * Extends the GenericList class to reuse shared functions
 */
export class ListWcagRulesComponent extends GenericList
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();

  public searchFilter: string;
  public listWcagRules: Criterions[];
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
    private manageWcagRulesService: ManageWcagRulesService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private wcagRulesService: WcagRulesService,
  ) {
    super();
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.emptyMessages = WcagRulesConstants.EMPTY_RESULTS[this.langIANA];
    this.setHTMLTitle(this.langIANA);

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.emptyMessages = WcagRulesConstants.EMPTY_RESULTS[event.lang];
      this.setHTMLTitle(this.langIANA);
    });
    this.manageModalInformation = WcagRulesConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.resetVaribles();
  }

  ngOnInit() {
    this.getWcagRules(null);
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
    this.sharedService.setTitle(WcagRulesConstants.HTML_TITLE[language].title);
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
   * @param event filter by the wcag rule
   */
  public applyFilter(event: Event): void {
    this.tableDataSource = super.applyFilter(event, this.tableDataSource);
    this.noResults = this.tableDataSource.filteredData.length === 0;
  }

  /**
   * Apply a filter by status
   * @param event filter by the wcag rule
   */
  public applyStateFilter(event: any): void {
    this.resetVaribles();
    if (event.index === 0) {
      this.getWcagRules(CommonConstants.MODEL_STATUS.ALL);
    } else if (event.index === 1) {
      this.getWcagRules(CommonConstants.MODEL_STATUS.ACTIVE);
    } else if (event.index === 2) {
      this.getWcagRules(CommonConstants.MODEL_STATUS.INACTIVE);
    }
  }

  /**
   * List wcag rules
   */
  public getWcagRules(status) {
    this.wcagRulesService
      .getAllCriterions<any>(status)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.listWcagRules = this.setStatusLabel(data.results);
        this.isEmpty = this.listWcagRules.length === 0;
        this.displayedColumns = WcagRulesConstants.TABLE_COLUMS;
        this.tableDataSource = new MatTableDataSource<Criterions>(
          this.listWcagRules,
        );
        this.initTableLabels(this.paginator);
        this.tableDataSource.paginator = this.paginator;
      });
  }

  /**
   * Call a modal to create a wcag rule
   */
  public newWcagRule(): void {
    this.manageModalInformation = WcagRulesConstants.MANAGE_MODAL_OPTIONS(
      false,
      this.langIANA,
    );
    this.manageWcagRulesService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.bodyText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.btnCancelTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.NEW,
      () => {
        this.getWcagRules(null);
      },
      () => {},
    );
  }

  /**
   * Call a modal to edit a wcag rule
   * @param wcagRuleItem item to edit
   */
  public editWcagRule(wcagRuleItem: Criterions): void {
    this.manageModalInformation = WcagRulesConstants.MANAGE_MODAL_OPTIONS(
      true,
      this.langIANA,
    );
    this.manageWcagRulesService.openDialog(
      this.manageModalInformation.titleText,
      this.manageModalInformation.bodyText,
      this.manageModalInformation.btnOkTextModal,
      this.manageModalInformation.btnCancelTextModal,
      this.manageModalInformation.withModal,
      CommonConstants.MODAL_STATUS.UPDATE,
      () => {
        this.getWcagRules(null);
      },
      () => {},
      wcagRuleItem,
    );
  }
}

import {Component, OnInit, Inject, ViewChild, OnDestroy} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {TranslateCacheService} from 'ngx-translate-cache';
import {TranslateService} from '@ngx-translate/core';

import {EvaluationService} from '../../../../evaluator/evaluations/evaluations.service';
import {Specifications} from '../../../../models/specifications';
import {SharedService} from '../../../shared.service';
import {EvaluatorEvaluationsConstants} from '../../../../evaluator/evaluations/evaluations.constants';
import {GenericList} from '../../../abstract-classes/list/list.abstract';
import {EvaluationsConstants} from '../list-evaluations.constants';
import {CommonConstants} from '../../../../common/common.constants';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-selection-page',
  templateUrl: './selection-page.component.html',
  styleUrls: ['./selection-page.component.scss'],
  providers: [EvaluationService],
})
/**
 * Selection component class
 */
export class SelectionPageComponent extends GenericList
  implements OnInit, OnDestroy {
  private pagesList: any[];

  public step: number;
  public specifications: Specifications[];
  public selectedSpecification: Specifications;
  public tableDataSource: any;
  public displayedColumns: string[];
  public isEmpty: boolean;
  public noResults: boolean;
  public selectedManualPage: any;
  public selectedPage: any;
  public emptyMessages: any;
  public langIANA: string;
  public isPageSelected: boolean;
  public userRole: number;
  public promoterRole: number;
  public directClient: number;
  public evaluatorRole: number;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  /**
   * Constructor class
   * @param dialogRef
   * @param data
   * @param evaluationService
   * @param sharedService
   * @param translate
   * @param translateCacheService
   */
  constructor(
    public dialogRef: MatDialogRef<SelectionPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private evaluationService: EvaluationService,
    private sharedService: SharedService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
    this.step = 0;
    this.selectedSpecification = null;
    this.tableDataSource = [];
    this.isEmpty = true;
    this.isPageSelected = true;
    this.displayedColumns =
      EvaluatorEvaluationsConstants.TABLE_COLUMS_EVALUATOR;

    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.emptyMessages =
      EvaluatorEvaluationsConstants.EMPTY_RESULTS[this.langIANA];
    this.userRole = this.sharedService.getUserInfoFromLocalStorage().roleTypesId;
    this.promoterRole = CommonConstants.roles.Promoter;
    this.directClient = CommonConstants.roles.DirectClient;
    this.evaluatorRole = CommonConstants.roles.Evaluator;
  }

  ngOnInit() {
    this.getSpeficications();
    this.openPageList();
  }

  openPageList() {
    if (this.sharedService.isItemInLocalStorage('spectInfo')) {
      this.selectedSpecification = JSON.parse(
        this.sharedService.getItemFromLocalStorage('spectInfo'),
      );
      this.sharedService.deleteItemFromLocalStorage('spectInfo');
      this.continueButton();
    }
  }

  ngOnDestroy() {
    // this.sharedService.deleteItemFromLocalStorage('spectInfo');
  }

  /**
   * Get specifications by evaluation id
   */
  private getSpeficications() {
    if (this.userRole === CommonConstants.roles.Evaluator) {
      this.evaluationService
        .getSpecificationsByEvaluation(
          this.data.evaluation.id,
          this.sharedService.getUserInfoFromLocalStorage().id,
        )
        .subscribe(data => {
          this.specifications = data.results;
        });
    } else if (
      this.userRole === CommonConstants.roles.Promoter ||
      this.userRole === CommonConstants.roles.DirectClient
    ) {
      this.evaluationService
        .getSpecificationsByEvaluation(this.data.evaluation.id, null)
        .subscribe(data => {
          this.specifications = data.results;
        });
    }
  }

  /**
   * Check a specification selected in the list, check the others as false
   * @param specification selected
   */
  public selectSpecificacion(specification: Specifications) {
    this.specifications.forEach(specificationItem => {
      if (specification === specificationItem) {
        if (specification.isSelected === true) {
          specificationItem.isSelected = false;
          this.selectedSpecification = null;
        } else {
          this.selectedSpecification = specification;
          specificationItem.isSelected = true;
        }
      } else {
        specificationItem.isSelected = false;
      }
    });
  }

  /**
   * Action when continue button is pressed
   */
  public continueButton() {
    if (this.step === 0) {
      this.step = 1;
      this.isPageSelected = false;
      this.evaluationService
        .getPagesBySpecification(this.selectedSpecification.id)
        .subscribe(data => {
          this.pagesList = data.results;
          this.tableDataSource = new MatTableDataSource<any>(this.pagesList);
          this.tableDataSource.paginator = this.paginator;
          this.isEmpty = this.pagesList.length === 0;
        });
    } else if (this.step === 1) {
      this.router.navigate([
        // tslint:disable-next-line: max-line-length
        `evaluator/manual-evaluation/${this.data.evaluation.id}/${this.selectedSpecification.id}/${this.selectedPage.id}/${this.selectedManualPage}`,
      ]);
      this.sharedService.setItemToLocalStorage(
        'evaluationInfo',
        JSON.stringify(this.data.evaluation),
      );
      this.sharedService.setItemToLocalStorage(
        'spectInfo',
        JSON.stringify(this.selectedSpecification),
      );
      this.dialogRef.close();
    }
  }

  /**
   * Action when tab button 1 is pressed
   */
  public goStepOne() {
    this.step = 0;
  }

  /**
   * Translate the state of the page in the table
   * @param state
   */
  public getStateTranslate(state) {
    return EvaluationsConstants.STR_STATES_SINGULAR[this.langIANA]()[state];
  }

  /**
   * Set the percentage value in the table
   * @param state
   */
  public getPercentagePage(state) {
    if (state === CommonConstants.EVALUATIONS_STATES.PENDING) {
      return '0%';
    } else if (state === CommonConstants.EVALUATIONS_STATES.PROGRESS) {
      return '50%';
    } else if (state === CommonConstants.EVALUATIONS_STATES.FINISHED) {
      return '100%';
    }
  }

  /**
   * On selection page change mark
   */
  public selectionPageChange(manualPage: number) {
    this.isPageSelected = true;
    this.selectedManualPage = manualPage;
  }

  /**
   * Cancel event of the modal
   */
  public cancel(): void {
    this.data.cancelFn();
    this.dialogRef.close();
  }
}

import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

import {SharedService} from '../../../../../shared/shared.service';
import {StatisticsService} from './statistics.service';
import {Evaluations} from '../../../../../models/evaluations.model';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})

/**
 * Statistics component class
 */
class StatisticsComponent implements OnInit {
  public pages: any[];
  public selectedPlaceholderGuideline: string;
  public filterForm: FormGroup;
  public automatic: boolean;
  public conformityLevel: string;
  public currentPackageName: string;
  public evaluation: Evaluations;
  public evaluationName: string;
  public evaluationType: string;
  public manual: boolean;
  public isServicesException: boolean;
  public principleList: any;
  public pagesSelected: any;
  public specificationSelected: any;
  public guideLineList: any;
  public guideLinesSelected: any;
  public specifications: any;

  /**
   * Constructor method
   * @param formBuilder
   * @param sharedService
   * @param statisticsService
   */
  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private statisticsService: StatisticsService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.automatic = false;
    this.conformityLevel = 'A';
    this.currentPackageName = '';
    this.evaluation = null;
    this.evaluationType = 'automatic';
    this.evaluationName = '';
    this.manual = false;
    this.isServicesException = false;
    this.principleList = [];
    this.pagesSelected = [];
    this.guideLineList = [];
    this.guideLinesSelected = [];
    this.selectedPlaceholderGuideline = '';
    this.specifications = [];
  }

  ngOnInit() {
    this.formConfiguration();
    this.activatedRoute.parent.parent.params.subscribe(params => {
      this.statisticsService.getEvaluation(params.id).subscribe(data => {
        this.evaluation = data.results;
        this.getEvaluationName(this.evaluation.packagesId);
        this.currentPackageName = this.evaluation.evaluationsPackages.name;
        this.getSpecificationsByEvaluation();
        this.getEvaluationPages();
      });
    });
  }

  /**
   * Initialize the form
   */
  private formConfiguration() {
    this.filterForm = this.formBuilder.group({
      pages: [''],
      specifications: [''],
    });
  }

  /**
   * Change the state of exception
   */
  private sendServiceDataToSubjectException() {
    this.isServicesException = true;
  }

  /**
   * Change the evalation type
   * @param evaluationType
   */
  public reloadEvaluationType(evaluationType) {
    this.evaluationType = evaluationType;
    if (evaluationType === 'manual') {
      this.getStatisticsByGuideLineManual();
    }
    if (evaluationType === 'automatic') {
      this.getStatisticsByGuideLineAutomatic();
    }
  }

  /**
   * Change the conformity level
   * @param conformityLevel
   */
  public reloadConformityLevel(conformityLevel) {
    this.conformityLevel = conformityLevel;
    if (this.evaluationType === 'manual') {
      this.getStatisticsByGuideLineManual();
    }
    if (this.evaluationType === 'automatic') {
      this.getStatisticsByGuideLineAutomatic();
    }
  }

  /**
   * Change the label of evaluation name
   * @param idPackagesPk
   */
  private getEvaluationName(idPackagesPk) {
    if (idPackagesPk === 1 || idPackagesPk === 2) {
      this.automatic = true;
      this.evaluationName = 'Automática';
      this.evaluationType = 'automatic';
    }
    if (idPackagesPk === 3) {
      this.manual = true;
      this.evaluationName = 'Manual';
      this.evaluationType = 'manual';
    }
    if (idPackagesPk === 4) {
      this.automatic = true;
      this.manual = true;
      this.evaluationName = 'Manual y Automática';
    }
  }

  /**
   * Get the pages by evaluation
   */
  private getEvaluationPages() {
    this.statisticsService
      .getPagesByEvaluation(this.evaluation.id)
      .subscribe(data => {
        this.pages = data.results;
      });
  }

  /**
   * Reload the displayed info manual of automatic
   * @param selectedPage
   */
  public reloadDataPage(selectedPage) {
    if (+selectedPage === 0) {
      this.pagesSelected = undefined;
    } else {
      this.pagesSelected = this.pages.filter(x => x.id === +selectedPage);
    }
    this.reloadEvaluationType(this.evaluationType);
  }

  /**
   * Reload the displayed data manual of automatic
   * @param selectedSpecification
   */
  public reloadDataSpecifications(selectedSpecification) {
    if (+selectedSpecification === 0) {
      this.specificationSelected = undefined;
    } else {
      this.specificationSelected = +selectedSpecification;
    }
    this.reloadEvaluationType(this.evaluationType);
  }

  /**
   * Get statistics by guideline automatic
   */
  private getStatisticsByGuideLineAutomatic() {
    this.statisticsService
      .getStatisticsByGuideLineAutomatic(
        this.evaluation.id,
        this.conformityLevel,
        this.guideLinesSelected,
        this.pagesSelected,
      )
      .subscribe(
        dataResponse => {
          dataResponse.evaluationType = 'automatic';
          this.statisticsService.statisticsServiceDataSubject = dataResponse;
        },
        error => {
          this.sendServiceDataToSubjectException();
        },
      );
  }

  /**
   * Get statistics by guideline manual
   */
  private getStatisticsByGuideLineManual() {
    this.statisticsService
      .getStatisticsByGuideLineManual(
        this.evaluation.id,
        this.specificationSelected,
        this.conformityLevel,
        this.guideLinesSelected,
        this.pagesSelected,
      )
      .subscribe(
        dataResponse => {
          dataResponse.evaluationType = 'automatic';
          this.statisticsService.statisticsServiceDataSubject = dataResponse;
        },
        error => {
          this.sendServiceDataToSubjectException();
        },
      );
  }

  /**
   * Get specifications by especifications
   */
  private getSpecificationsByEvaluation() {
    this.statisticsService
      .getSpecificationsByEvaluation(this.evaluation.id)
      .subscribe(data => {
        this.specifications = data;
      });
  }
}

export {StatisticsComponent};

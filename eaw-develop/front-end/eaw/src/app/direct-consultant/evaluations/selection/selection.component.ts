import {Component, OnInit, OnDestroy} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {Router, ActivatedRoute} from '@angular/router';
import {TranslateCacheService} from 'ngx-translate-cache';

import {SharedService} from '../../../shared/shared.service';
import {EvaluationConstants} from '../evaluations.constants';
import {EvaluationsService} from '../evaluations.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss'],
  providers: [EvaluationsService],
})
/**
 * Class for selection component
 */
export class SelectionComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  private clienId: number;
  private countryId: number;
  private selectedYear: number;
  private selectedSegment: number;
  private selectedIndirectClient: number;

  public list: any;
  public langIANA: string;
  public step: number;
  public subtitle: string;

  /**
   * Constructor method
   * @param router
   * @param activatedRoute
   * @param translate
   * @param translateCacheService
   * @param evaluationService
   * @param sharedService
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private evaluationService: EvaluationsService,
    public sharedService: SharedService,
  ) {
    this.list = [];
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.setHTMLTitle(this.langIANA);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.setHTMLTitle(this.langIANA);
    });

    this.loadValues();
    this.clienId = this.sharedService.getUserInfoFromLocalStorage().id;
  }

  ngOnInit() {
    this.getCountryByClient();
    switch (this.step) {
      case 0:
        this.getEvaluationYears();
        break;
      case 1:
        this.getSegments();
        break;
      case 2:
        this.getIndirectClients();
        break;
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Load sevaed values from local storage
   */
  private loadValues() {
    let options = this.evaluationService.getItemFromLocalStorage(
      'persistentOptionsEvaluations',
    );
    if (options) {
      options = JSON.parse(options);
      this.step = options.step;
      this.selectedYear = options.selectedYear;
      this.selectedSegment = options.selectedSegment;
      this.selectedIndirectClient = options.selectedIndirectClient;
      this.subtitle =
        EvaluationConstants.VIEW_EVALUATIONS[this.langIANA].subtitleYear;
    } else {
      this.step = 0;
      this.selectedYear = null;
      this.subtitle =
        EvaluationConstants.VIEW_EVALUATIONS[this.langIANA].subtitleYear;
    }
  }

  /**
   * Get the countryId by client logged
   */
  private getCountryByClient() {
    this.evaluationService.getCountryByClient(this.clienId).subscribe(data => {
      this.countryId = data.countriesId;
    });
  }

  /**
   * Change the HTML title
   * @param language string language
   */
  private setHTMLTitle(language: string) {
    this.sharedService.setTitle(
      EvaluationConstants.HTML_EVALUATIONS_TITLE[language].title,
    );
  }

  /**
   * Save selected values in local storage
   */
  private saveValues() {
    const options = {
      step: this.step,
      selectedYear: this.selectedYear,
      selectedSegment: this.selectedSegment,
      selectedIndirectClient: this.selectedIndirectClient,
    };
    this.evaluationService.setItemToLocalStorage(
      'persistentOptionsEvaluations',
      JSON.stringify(options),
    );
  }

  /**
   * Get a list segments
   */
  private getSegments() {
    this.evaluationService
      .getSegmensByCountry(this.countryId)
      .subscribe(data => {
        this.list = data;
      });
  }

  /**
   * Get a list of indirect clients
   */
  private getIndirectClients() {
    this.evaluationService
      .getIndirectClientsByClient(
        this.clienId,
        `${this.selectedYear}`,
        this.selectedSegment,
      )
      .subscribe(data => {
        this.list = data.results;
      });
  }

  /**
   * Action when step one is pressed
   */
  private goStepOne() {
    this.selectedYear = null;
    this.selectedSegment = null;
    this.selectedIndirectClient = null;
    this.step = 0;
    this.subtitle =
      EvaluationConstants.VIEW_EVALUATIONS[this.langIANA].subtitleYear;
    this.saveValues();
    this.getEvaluationYears();
  }

  /**
   * Action when step two is pressed
   */
  private goToStepTwo() {
    this.selectedSegment = null;
    this.selectedIndirectClient = null;
    this.step = 1;
    this.subtitle =
      EvaluationConstants.VIEW_EVALUATIONS[this.langIANA].subtitleSegment;
    this.saveValues();
    this.getSegments();
  }

  /**
   * Get a list of years of the evaluations
   */
  public getEvaluationYears() {
    this.evaluationService
      .getEvaluationsYears()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.list = data.results;
      });
  }

  /**
   * Changes the list displayed
   * @param selectedItem
   */
  public getSelectedItem(selectedItem) {
    if (this.step === 0) {
      this.selectedYear = selectedItem.id;
      this.step = 1;
      this.subtitle =
        EvaluationConstants.VIEW_EVALUATIONS[this.langIANA].subtitleSegment;
      this.saveValues();
      this.getSegments();
    } else if (this.step === 1) {
      this.selectedSegment = selectedItem.id;
      this.step = 2;
      this.subtitle =
        EvaluationConstants.VIEW_EVALUATIONS[this.langIANA].subtitleClient;
      this.saveValues();
      this.getIndirectClients();
    } else if (this.step === 2) {
      this.selectedIndirectClient = selectedItem.id;
      this.router.navigate(
        [
          `list/${this.clienId}/${this.selectedYear}/${this.selectedSegment}/${this.selectedIndirectClient}`,
        ],
        {
          relativeTo: this.activatedRoute.parent.parent,
        },
      );
    }
  }

  /**
   * Get selected step clicked b the user
   * @param step
   */
  public getSelectedStep(step) {
    if (step === 0) {
      this.goStepOne();
    } else if (step === 1) {
      this.goToStepTwo();
    }
  }
}

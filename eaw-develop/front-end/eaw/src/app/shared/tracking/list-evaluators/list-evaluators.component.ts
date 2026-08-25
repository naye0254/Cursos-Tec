import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {TrackingService} from '../tracking.service';
import {Evaluator} from '../../../models/evaluators.model';
import {SharedService} from '../../../shared/shared.service';
import {TrackingPageConstants} from '../tracking.constants';

@Component({
  selector: 'app-list-evaluators',
  templateUrl: './list-evaluators.component.html',
  styleUrls: ['./list-evaluators.component.scss'],
  providers: [TrackingPageConstants],
})

/**
 * Component to list all evaluator to make a tracking
 */
export class ListEvaluatorsComponent implements OnInit {
  public listEvaluators: Evaluator[] = [];
  public langIANA: string;
  public emptyMessages: string;

  /**
   * Constructor of the component
   * @param trackingService
   * @param router
   * @param activatedRoute
   * @param translateCacheService
   * @param sharedService
   * @param translate
   */
  constructor(
    private trackingService: TrackingService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translateCacheService: TranslateCacheService,
    private sharedService: SharedService,
    private translate: TranslateService,
  ) {
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.emptyMessages = TrackingPageConstants.EMPTY_RESULTS[this.langIANA];
    this.setHTMLTitle(this.langIANA);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.emptyMessages = TrackingPageConstants.EMPTY_RESULTS[this.langIANA];
      this.setHTMLTitle(this.langIANA);
    });
    this.trackingService.setQuantityEvalPromoterEvaluator(null);
  }

  ngOnInit() {
    this.getEvaluators();
  }

  /**
   * Take a list of evaluators by the status
   * @param status if the evaluator is active
   */
  private getEvaluators() {
    this.trackingService.getAllEvaluators<any>().subscribe(data => {
      this.listEvaluators = data.results;
    });
  }

  /**
   * Go to the page with evaluations by evaluator
   * @param evalautorId
   */
  goToTrackingEvaluator(evalautorId: number): void {
    this.router.navigate(['list-evaluations', evalautorId], {
      relativeTo: this.activatedRoute.parent,
    });
  }

  /**
   * Change the HTML title
   * @param language string language
   */
  private setHTMLTitle(language: string) {
    this.sharedService.setTitle(
      TrackingPageConstants.HTML_TITLE_LIST_EVALUATORS[language].title,
    );
  }
}

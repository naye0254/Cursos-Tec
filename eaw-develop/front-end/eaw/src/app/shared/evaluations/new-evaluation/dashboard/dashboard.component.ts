import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {SharedService} from '../../../../shared/shared.service';
import {AdministratorEvaluationsConstants} from '../../evaluations.constants';
import {NewEvaluationService} from '../new-evaluation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [AdministratorEvaluationsConstants],
})
export class DashboardComponent implements OnInit {
  public step: number;
  public stepOne: string;
  public stepTwo: string;
  public langIANA: string;
  public isHideStepTwo: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private translateCacheService: TranslateCacheService,
    private translate: TranslateService,
    private newEvaluationService: NewEvaluationService,
  ) {
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.setHTMLTitle(this.langIANA);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.setHTMLTitle(this.langIANA);
    });
    this.step = 0;
    this.stepOne = 'step-1';
    this.stepTwo = 'step-2';
    this.newEvaluationService.getHideStepTwo().subscribe(stateToStepTwo => {
      this.isHideStepTwo = stateToStepTwo;
    });
  }

  ngOnInit() {}

  /**
   * Navigate to the step One of the form
   */
  goToStepOne(): void {
    this.step = 0;
  }

  /**
   * Navigate to the step One of the form
   */
  goToStepTwo(): void {
    this.step = 1;
  }

  /**
   * Change the HTML title
   * @param language string language
   */
  private setHTMLTitle(language: string) {
    this.sharedService.setTitle(
      AdministratorEvaluationsConstants.HTML_NEW_EVALUATION[language].title,
    );
  }
}

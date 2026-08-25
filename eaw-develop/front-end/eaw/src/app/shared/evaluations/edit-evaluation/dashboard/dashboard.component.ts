import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {SharedService} from '../../../../shared/shared.service';
import {AdministratorEvaluationsConstants} from '../../evaluations.constants';
import {EditEvaluationService} from '../edit-evaluation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [AdministratorEvaluationsConstants]
})
export class DashboardComponent implements OnInit {
  public step: number;
  public stepOne: string;
  public stepTwo: string;
  public langIANA: string;
  public isHideStepTwo: boolean;
  public evaluationId: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private translateCacheService: TranslateCacheService,
    private translate: TranslateService,
    private newEvaluationService: EditEvaluationService
  ) {
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.setHTMLTitle(this.langIANA);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.setHTMLTitle(this.langIANA);
    });
    this.step = 0;
    this.newEvaluationService.getHideStepTwo().subscribe(stateToStepTwo => {
      // this.isHideStepTwo = stateToStepTwo;
      this.isHideStepTwo = true; // is always hidden by the moment
    });
  }

  ngOnInit() {
    this.stepOne = `step-1/${localStorage.getItem('evaluationId')}`;
    this.stepTwo = `step-2/${localStorage.getItem('evaluationId')}`;
  }

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
      AdministratorEvaluationsConstants.HTM_EDIT_EVALUATION[language].title
    );
  }
}

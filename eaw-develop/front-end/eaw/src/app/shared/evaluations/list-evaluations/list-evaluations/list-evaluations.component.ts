import {Component, OnInit} from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {SharedService} from '../../../../shared/shared.service';
import {AdministratorEvaluationsConstants} from '../../evaluations.constants';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-list-administrator-evaluations',
  templateUrl: './list-evaluations.component.html',
  styleUrls: ['./list-evaluations.component.scss'],
  providers: [AdministratorEvaluationsConstants],
})
export class ListEvaluationsComponent implements OnInit {
  public langIANA: string;
  public evaluationState: number;

  constructor(
    private translateCacheService: TranslateCacheService,
    private translate: TranslateService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.evaluationState = 0;
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.setHTMLTitle(this.langIANA);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.setHTMLTitle(this.langIANA);
    });
  }

  ngOnInit() {}

  /**
   * Change the HTML title
   * @param language string language
   */
  private setHTMLTitle(language: string) {
    this.sharedService.setTitle(
      AdministratorEvaluationsConstants.HTML_LIST_EVALUATIONS[language].title,
    );
  }

  /**
   * Get selected Evaluation of the componet child
   * @param selectedEvaluation
   */
  public getSelectedEvaluation(selectedEvaluation) {
    console.log(selectedEvaluation);
  }
}

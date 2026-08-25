import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { TranslateCacheService } from 'ngx-translate-cache';
import { SharedService } from 'src/app/shared/shared.service';
import { AdministratorEvaluationsConstants } from '../../evaluations.constants';

@Component({
  selector: 'app-administrator-evaluations-reports',
  templateUrl: './evaluation-reports.component.html',
  styleUrls: ['./evaluation-reports.component.scss'],
  providers: [AdministratorEvaluationsConstants]
})
export class EvaluationReportsComponent implements OnInit {
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

  ngOnInit() {
  }

  private setHTMLTitle(language: string) {
    this.sharedService.setTitle(
      AdministratorEvaluationsConstants.HTML_EVALUATION_REPORTS[language].title,
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

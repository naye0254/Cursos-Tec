import {Component, OnInit} from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {EvaluatorEvaluationsConstants} from '../evaluations.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [EvaluatorEvaluationsConstants],
})
export class DashboardComponent implements OnInit {
  public sidebarAdministratorEvaluationsOptions: any;

  constructor(
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    this.sidebarAdministratorEvaluationsOptions =
      EvaluatorEvaluationsConstants.SIDEBAR_EVALUATOR_EVALUATIONS_OPTIONS[
        translateCacheService.getCachedLanguage()
      ];

    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.sidebarAdministratorEvaluationsOptions =
        EvaluatorEvaluationsConstants.SIDEBAR_EVALUATOR_EVALUATIONS_OPTIONS[
          event.lang
        ];
    });
  }

  ngOnInit() {}
}

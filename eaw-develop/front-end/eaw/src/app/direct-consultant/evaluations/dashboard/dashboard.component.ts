import {Component, OnInit} from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {DirectClientConstants} from '../../direct-consultant.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DirectClientConstants],
})
export class DashboardComponent implements OnInit {
  public sidebarAdministratorEvaluationsOptions: any;

  constructor(
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    this.sidebarAdministratorEvaluationsOptions =
      DirectClientConstants.SIDEBAR_EVALUATION_DIRECT_CLIENT_OPTIONS[
        translateCacheService.getCachedLanguage()
      ];

    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.sidebarAdministratorEvaluationsOptions =
        DirectClientConstants.SIDEBAR_EVALUATION_DIRECT_CLIENT_OPTIONS[
          event.lang
        ];
    });
  }

  ngOnInit() {}
}

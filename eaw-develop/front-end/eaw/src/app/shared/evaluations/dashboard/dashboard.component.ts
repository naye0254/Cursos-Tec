import {Component, OnInit} from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {AdministratorEvaluationsConstants} from '../evaluations.constants';
import {SharedService} from '../../shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [AdministratorEvaluationsConstants]
})
export class DashboardComponent implements OnInit {
  public sidebarAdministratorEvaluationsOptions: any;

  /*
   * Getting user from local storage to match the user type to use the
   * new evaluations shared module
   */
  private userDetail: any;

  constructor(
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.userDetail = JSON.parse(this.sharedService.getItemFromLocalStorage('userDetail'));
    const ADMIN_ROLE = 2;

    if (this.userDetail.roleTypesId === ADMIN_ROLE) {
      this.sidebarAdministratorEvaluationsOptions =
        AdministratorEvaluationsConstants.SIDEBAR_ADMINISTRATOR_EVALUATIONS_OPTIONS[
          this.translateCacheService.getCachedLanguage()
        ];

      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.sidebarAdministratorEvaluationsOptions =
          AdministratorEvaluationsConstants.SIDEBAR_ADMINISTRATOR_EVALUATIONS_OPTIONS[event.lang];
      });
    } // user is super-admin
    else {
      this.sidebarAdministratorEvaluationsOptions =
        AdministratorEvaluationsConstants.SIDEBAR_SUPER_ADMINISTRATOR_EVALUATIONS_OPTIONS[
          this.translateCacheService.getCachedLanguage()
        ];

      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.sidebarAdministratorEvaluationsOptions =
          AdministratorEvaluationsConstants.SIDEBAR_SUPER_ADMINISTRATOR_EVALUATIONS_OPTIONS[
            event.lang
          ];
      });
    }
  }
}
